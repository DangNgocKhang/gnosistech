import { GNOSIS_API_URL } from "../../config";
import getAxiosClient from "../axios/axiosClient";

export const handleUploadFiles = async ( listFile: FileList) => {
  const formData = new FormData();
  for (let i = 0; i < listFile.length; i++) {
    formData.append("files", listFile[i]);
  }

  try {
    const axiosClient = getAxiosClient()
    const response = await axiosClient.post(`${GNOSIS_API_URL}/upload/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.status;
  } catch (error) {
    throw new Error("File upload failed");
  }
};
/*--------------------------------------------
  --------------- CHECK ZIP FILE  ----------------
  -------------------------------------------- */
export const handleUploadCheckZipFiles = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const axiosClient = getAxiosClient()
    const response = await axiosClient.post(
      `${GNOSIS_API_URL}/upload/checked_zip/`,
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
