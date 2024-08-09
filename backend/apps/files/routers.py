import importlib
import io
import os
import shutil
import subprocess
import sys
import zipfile
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional

from dotenv import load_dotenv
from fastapi import (
    APIRouter,
    Depends,
    File,
    Form,
    HTTPException,
    Query,
    UploadFile,
    status,
)
from fastapi.responses import JSONResponse, StreamingResponse
from pydantic import ValidationError

from apps.accounts import schemas
from apps.accounts.services.authenticate import AccountService

from .schemas import DataFrameModel, UploadFileSchema

router = APIRouter(prefix="/file", tags=["File Manage"])

load_dotenv()  # Load variables from .env file

UPLOAD_DIR = Path(os.getenv("UPLOAD_DIR"))
UPLOAD_DIR.mkdir(exist_ok=True)


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
    "/checked-zip/",
    status_code=status.HTTP_201_CREATED,
    summary="Check zip file upload",
    description="Check if the zip file contains the required files. Check if functions gen_feat and gen_post exist.",
    response_model=List[UploadFileSchema],
)
async def checked_zip(
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


"""
---------------------------------------
--------------- UPLOAD FILES ----------
---------------------------------------
"""


@router.post(
    "/upload",
    status_code=status.HTTP_201_CREATED,
    summary="Upload multiple files",
    description="Endpoint to upload multiple files along with a user ID",
)
async def upload_files(
    current_user: schemas.UserFirebase = Depends(AccountService.current_user_firebase),
    file: UploadFile = File(...),
    paths: List[str] = Query([]),
):
    # Create folder named with user ID
    user_dir = UPLOAD_DIR / current_user.user_id

    if paths:
        user_dir = user_dir.joinpath(*paths)

    user_dir.mkdir(parents=True, exist_ok=True)

    # Save the uploaded ZIP file
    zip_path = os.path.join(user_dir, file.filename)
    with open(zip_path, "wb") as f:
        f.write(await file.read())

    # Extract the ZIP file
    try:
        with zipfile.ZipFile(zip_path, "r") as zip_ref:
            zip_ref.extractall(user_dir)
    except zipfile.BadZipFile:
        raise HTTPException(status_code=400, detail="Failed to extract ZIP file")
    os.remove(zip_path)


"""
---------------------------------------
-------- GET LIST FILE AND FOLDER -----
---------------------------------------
"""


@router.get(
    "/list-files",
    status_code=status.HTTP_200_OK,
    summary="List Files and Folders",
    description="Retrieve a list of files and folders in the user's directory. "
    "Provide an array of strings representing the path to navigate through nested directories. "
    "Returns a dictionary with two keys: 'folders' (a list of folder names) and 'files' (a list of file names) in the specified directory.",
    response_model=Dict[str, List[str]],
)
async def list_files(
    current_user: schemas.UserFirebase = Depends(AccountService.current_user_firebase),
    paths: List[str] = Query([]),
):
    user_dir = UPLOAD_DIR / current_user.user_id

    if paths:
        user_dir = user_dir.joinpath(*paths)

    if not user_dir.exists() or not user_dir.is_dir():
        raise HTTPException(status_code=404, detail="Directory not found")

    folders = [f.name for f in user_dir.iterdir() if f.is_dir()]
    files = [f.name for f in user_dir.iterdir() if f.is_file()]

    return {"folders": folders, "files": files}


"""
---------------------------------------
--------------- DOWNLOAD FILE ---------
---------------------------------------
"""


@router.get(
    "/download",
    status_code=status.HTTP_200_OK,
    summary="Download a ZIP file with selected files and directories",
    description="Endpoint to download selected files and directories as a ZIP, organized in a folder named with the current date and time",
)
async def download(
    current_user: schemas.UserFirebase = Depends(AccountService.current_user_firebase),
    file_names: Optional[List[str]] = Query(
        [], description="List of filenames to include in the ZIP"
    ),
    directory_names: Optional[List[str]] = Query(
        [], description="List of directory names to include in the ZIP"
    ),
    paths: List[str] = Query([]),
):
    user_dir = UPLOAD_DIR / current_user.user_id

    if paths:
        user_dir = user_dir.joinpath(*paths)

    if not user_dir.exists() or not user_dir.is_dir():
        raise HTTPException(status_code=404, detail="User directory not found")

    selected_files = []
    for filename in file_names:
        file_path = user_dir / filename
        if file_path.exists() and file_path.is_file():
            selected_files.append(file_path)
        else:
            raise HTTPException(status_code=404, detail=f"File '{filename}' not found")

    selected_directories = []
    for directory_name in directory_names:
        directory_path = user_dir / directory_name
        if directory_path.exists() and directory_path.is_dir():
            selected_directories.append(directory_path)
        else:
            raise HTTPException(
                status_code=404, detail=f"Directory '{directory_name}' not found"
            )

    zip_bytes_io = io.BytesIO()
    with zipfile.ZipFile(zip_bytes_io, "w", zipfile.ZIP_DEFLATED) as zipped:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        folder_name = f"{timestamp}/"

        for file_path in selected_files:
            arcname = folder_name + file_path.name
            zipped.write(file_path, arcname=arcname)

        for directory_path in selected_directories:
            for root, dirs, files in os.walk(directory_path):
                if not files and not dirs:
                    empty_dir_arcname = (
                        folder_name + str(Path(root).relative_to(user_dir)) + "/"
                    )
                    zipped.writestr(empty_dir_arcname, "")
                for file in files:
                    file_path = Path(root) / file
                    arcname = folder_name + str(file_path.relative_to(user_dir))
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


"""
---------------------------------------
--------------- DELETE FILE -----------
---------------------------------------
"""


@router.delete(
    "/delete",
    status_code=status.HTTP_200_OK,
    summary="Delete files or folders",
    description="Endpoint to delete files, folders, or both",
)
async def delete(
    current_user: schemas.UserFirebase = Depends(AccountService.current_user_firebase),
    file_names: Optional[List[str]] = Query(
        [], description="List of filenames to delete"
    ),
    directory_names: Optional[List[str]] = Query(
        [], description="List of directory names to delete"
    ),
    paths: List[str] = Query([]),
):
    user_dir = UPLOAD_DIR / current_user.user_id

    if paths:
        user_dir = user_dir.joinpath(*paths)

    if not user_dir.exists() or not user_dir.is_dir():
        raise HTTPException(status_code=404, detail="User folder not found")

    deleted_files = []
    not_found_files = []
    deleted_folders = []
    not_found_folders = []

    # Delete files if any
    for filename in file_names:
        file_location = user_dir / filename
        if file_location.exists() and file_location.is_file():
            file_location.unlink()
            deleted_files.append(filename)
        else:
            not_found_files.append(filename)

    # Delete folders if any
    for foldername in directory_names:
        folder_location = user_dir / foldername
        if folder_location.exists() and folder_location.is_dir():
            shutil.rmtree(
                folder_location
            )  # Recursively delete the folder and its contents
            deleted_folders.append(foldername)
        else:
            not_found_folders.append(foldername)

    response_content = {
        "deleted_files": deleted_files,
        "not_found_files": not_found_files,
        "deleted_folders": deleted_folders,
        "not_found_folders": not_found_folders,
    }

    return JSONResponse(content=response_content)
