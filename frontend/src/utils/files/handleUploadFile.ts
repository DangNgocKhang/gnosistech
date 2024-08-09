import JSZip from "jszip";
import { GNOSIS_API_URL } from "../../config";
import getAxiosClient from "../axios/axiosClient";

/*--------------------------------------------
  --------------- CHECK ZIP FILE  ----------------
  -------------------------------------------- */
export const handleUploadCheckZipFiles = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const axiosClient = getAxiosClient();
    const response = await axiosClient.post(
      `${GNOSIS_API_URL}/file/checked-zip/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response;
  } catch (error) {
    throw new Error("Error uploading file");
  }
};

/*--------------------------------------------
  --------------- ZIP AND UPLOAD FILE -----------
  -------------------------------------------- */

export const handleUpload = async (
  entries: { handle: FileSystemHandle; type: string; path: string }[],
  paths: string[]
) => {
  const zip = new JSZip();

  // Helper function to add directory structure to the zip
  const addDirectoryToZip = (path: string) => {
    if (path) {
      zip.folder(path);
    }
  };

  // Add files and directories to the zip
  for (const entry of entries) {
    if (entry.type === "file") {
      const fileHandle = entry.handle as FileSystemFileHandle;
      const file = await fileHandle.getFile();
      const content = await file.arrayBuffer();
      zip.file(entry.path, content);
    } else if (entry.type === "directory") {
      // Ensure the directory structure is included
      addDirectoryToZip(entry.path);
    }
  }

  // Generate the zip file
  const zipBlob = await zip.generateAsync({ type: "blob" });
  try {
    // Send the zip file to FastAPI
    const formData = new FormData();
    formData.append("file", zipBlob, "archive.zip");

    const queryParams = new URLSearchParams();
    paths.forEach((path) => queryParams.append("paths", path));

    const axiosClient = getAxiosClient();
    const response = await axiosClient.post(
      `${GNOSIS_API_URL}/file/upload?${queryParams}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response;
  } catch (error) {
    throw new Error("File upload failed");
  }
};
