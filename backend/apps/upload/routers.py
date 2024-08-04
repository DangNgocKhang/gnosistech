from datetime import datetime
import importlib
import io
import os
import shutil
import sys
from typing import List
import zipfile
from dotenv import load_dotenv
from fastapi import (
    APIRouter,
    Depends,
    File,
    Query,
    UploadFile,
    status,
    HTTPException,
    Form,
)
from fastapi.responses import FileResponse, JSONResponse, StreamingResponse
from pathlib import Path
import subprocess

from pydantic import ValidationError
from .schemas import DataFrameModel, UploadFileSchema


from apps.accounts import schemas
from apps.accounts.services.authenticate import AccountService


router = APIRouter(prefix="/upload", tags=["Upload"])

load_dotenv()  # Load variables from .env file

UPLOAD_DIR = Path(os.getenv("UPLOAD_DIR"))
UPLOAD_DIR.mkdir(exist_ok=True)


@router.post(
    "/",
    status_code=status.HTTP_201_CREATED,
    summary="Upload multiple files",
    description="Endpoint to upload multiple files along with a user ID",
    response_model=List[UploadFileSchema],
)
async def upload_files(
    current_user: schemas.UserFirebase = Depends(AccountService.current_user_firebase),
    files: List[UploadFile] = File(...),
):
    # Create folder named with user ID
    user_dir = UPLOAD_DIR / current_user.user_id
    user_dir.mkdir(parents=True, exist_ok=True)

    file_info = []
    for file in files:
        file_location = user_dir / file.filename
        with open(file_location, "wb") as f:
            f.write(file.file.read())
        file_info.append({"filename": file.filename, "content_type": file.content_type})

    return JSONResponse(content={"files": file_info})


"""
---------------------------------------
--------------- CHECK FILE ZIP --------
---------------------------------------
"""


def is_dataframe(obj):
    try:
        DataFrameModel(data=obj)
        return True
    except ValidationError:
        return False


@router.post(
    "/checked_zip/",
    status_code=status.HTTP_201_CREATED,
    summary="Check zip file upload",
    description="Check if the zip file contains the required files. Check if functions gen_feat and gen_post exist.",
    response_model=List[UploadFileSchema],
)
async def upload_file(
    current_user: schemas.UserFirebase = Depends(AccountService.current_user_firebase),
    file: UploadFile = File(...),
):
    # Create file to contain checked file
    temp_dir = os.path.join(os.getcwd(), "temp_upload")
    os.makedirs(temp_dir, exist_ok=True)

    # Save the uploaded ZIP file
    zip_path = os.path.join(temp_dir, file.filename)
    with open(zip_path, "wb") as f:
        f.write(await file.read())

    # Extract the ZIP file
    try:
        with zipfile.ZipFile(zip_path, "r") as zip_ref:
            zip_ref.extractall(temp_dir)
    except zipfile.BadZipFile:
        raise HTTPException(status_code=400, detail="Failed to extract ZIP file")

    # Remove the ZIP file after extraction
    os.remove(zip_path)

    # Detect if the extracted contents are in a subdirectory
    extracted_files = os.listdir(temp_dir)
    if len(extracted_files) == 1 and os.path.isdir(
        os.path.join(temp_dir, extracted_files[0])
    ):
        temp_dir = os.path.join(temp_dir, extracted_files[0])
        extracted_files = os.listdir(temp_dir)

    # Check for the required files in the root directory
    required_files = {"main.py", "makefile", "requirements.txt"}
    uploaded_files = set(os.listdir(temp_dir))

    if not required_files.issubset(uploaded_files):
        raise HTTPException(
            status_code=400,
            detail="Missing required files: main.py, makefile, requirements.txt",
        )

    # Check files within folders
    for root, dirs, files in os.walk(temp_dir):
        for file in files:
            if os.path.commonpath([temp_dir]) != os.path.commonpath([temp_dir, root]):
                # If the file is in a subdirectory, it must be a Python file
                if not file.endswith(".py"):
                    raise HTTPException(
                        status_code=400,
                        detail=f"Invalid file type found in folder: {file}",
                    )

    # Set up a virtual environment
    venv_dir = os.path.join(temp_dir, "venv")
    try:
        subprocess.run([sys.executable, "-m", "venv", venv_dir], check=True)
    except subprocess.CalledProcessError as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to create virtual environment: {str(e)}"
        )

    # Activate the virtual environment and install packages from requirements.txt
    if os.name == "nt":
        pip_executable = os.path.join(venv_dir, "Scripts", "pip.exe")
    else:
        pip_executable = os.path.join(venv_dir, "bin", "pip")

    requirements_path = os.path.join(temp_dir, "requirements.txt")
    try:
        subprocess.run([pip_executable, "install", "-r", requirements_path], check=True)
    except subprocess.CalledProcessError as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to install packages: {str(e)}"
        )

    # Function to dynamically import and run a function from a module
    def run_function_from_module(module_path, function_name):
        spec = importlib.util.spec_from_file_location("module.name", module_path)
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        func = getattr(module, function_name)
        return func()

    # Run and check the output of gen_df and gen_pos
    data_gen_path = os.path.join(temp_dir, "common", "core", "data_gen.py")
    pos_gen_path = os.path.join(temp_dir, "common", "core", "pos_gen.py")

    try:
        gen_df_output = run_function_from_module(data_gen_path, "gen_feat")
        gen_pos_output = run_function_from_module(pos_gen_path, "gen_pos")
    except Exception as e:
        raise HTTPException(
            status_code=400, detail=f"Failed to run functions: {str(e)}"
        )

    if not is_dataframe(gen_df_output) or not is_dataframe(gen_pos_output):
        raise HTTPException(status_code=400, detail="Output is not a pandas DataFrame")

    # Log the output
    log_path = os.path.join(os.getcwd(), "output_log.txt")
    with open(log_path, "w") as log_file:
        log_file.write(f"gen_df output:\n{gen_df_output}\n\n")
        log_file.write(f"gen_pos output:\n{gen_pos_output}\n")

    # Clean up the temporary directory
    shutil.rmtree(temp_dir)

    return JSONResponse(
        content={
            "message": "Files uploaded, functions executed, and output logged successfully!"
        }
    )


@router.get(
    "/list_files",
    status_code=status.HTTP_200_OK,
    summary="Get all filenames",
    description="Endpoint to get all filenames for the authenticated user",
)
async def get_all_files(
    current_user: schemas.UserFirebase = Depends(AccountService.current_user_firebase),
):
    # Use the user_id from the authenticated current_user
    user_dir = UPLOAD_DIR / current_user.user_id

    if not user_dir.exists() or not user_dir.is_dir():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User folder not found"
        )

    files = [file.name for file in user_dir.iterdir() if file.is_file()]
    return JSONResponse(content={"files": files})


@router.get(
    "/download/zip",
    status_code=status.HTTP_200_OK,
    summary="Download a ZIP file with selected files",
    description="Endpoint to download selected files as a ZIP, organized in a folder named with the current date and time",
)
async def download_selected_files(
    current_user: schemas.UserFirebase = Depends(AccountService.current_user_firebase),
    filenames: list[str] = Query(...),
):
    user_dir = UPLOAD_DIR / current_user.user_id
    if not user_dir.exists() or not user_dir.is_dir():
        raise HTTPException(status_code=404, detail="User directory not found")

    # Check if requested files exist
    selected_files = []
    for filename in filenames:
        file_path = user_dir / filename
        if file_path.exists() and file_path.is_file():
            selected_files.append(file_path)
        else:
            raise HTTPException(status_code=404, detail=f"File '{filename}' not found")

    # Create a BytesIO buffer to write the ZIP file into
    zip_bytes_io = io.BytesIO()
    with zipfile.ZipFile(zip_bytes_io, "w", zipfile.ZIP_DEFLATED) as zipped:
        # Create a folder named with the current date and time
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        folder_name = f"{timestamp}/"

        # Add each selected file to the ZIP, placing them in the timestamped folder
        for file_path in selected_files:
            arcname = folder_name + file_path.name
            zipped.write(file_path, arcname=arcname)

    zip_bytes_io.seek(0)
    response = StreamingResponse(
        zip_bytes_io,
        media_type="application/x-zip-compressed",
        headers={
            "Content-Disposition": f"attachment; filename={timestamp}.zip",
            "Content-Length": str(zip_bytes_io.getbuffer().nbytes),
        },
    )
    return response


@router.get(
    "/download/{filename}",
    status_code=status.HTTP_200_OK,
    summary="Download a file",
    description="Endpoint to download a file",
)
async def get_file(
    filename: str,
    current_user: schemas.UserFirebase = Depends(AccountService.current_user_firebase),
):
    file_location = UPLOAD_DIR / current_user.user_id / filename
    if not file_location.exists():
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(file_location)


@router.delete(
    "/delete_files",
    status_code=status.HTTP_200_OK,
    summary="Delete a file",
    description="Endpoint to delete a file or multiple files",
)
async def delete_files(
    current_user: schemas.UserFirebase = Depends(AccountService.current_user_firebase),
    filenames: List[str] = Form(...),
):
    user_dir = UPLOAD_DIR / current_user.user_id
    if not user_dir.exists() or not user_dir.is_dir():
        raise HTTPException(status_code=404, detail="User folder not found")

    deleted_files = []
    not_found_files = []

    for filename in filenames:
        file_location = user_dir / filename
        if file_location.exists():
            file_location.unlink()
            deleted_files.append(filename)
        else:
            not_found_files.append(filename)

    response_content = {
        "deleted_files": deleted_files,
        "not_found_files": not_found_files,
    }

    return JSONResponse(content=response_content)
