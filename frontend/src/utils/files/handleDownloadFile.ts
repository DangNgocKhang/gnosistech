import { GNOSIS_API_URL } from "../../config";
import getAxiosClient from "../axios/axiosClient";

export const handleFileDownload = async ( filename: string) => {
  try {
    const axiosClient = getAxiosClient()
    const response = await axiosClient.get(
      `${GNOSIS_API_URL}/upload/download/${filename}`,
      {
        responseType: "blob",
      }
    );
    const result = {
      response: response,
      fileName: filename,
    };
    return result;
  } catch (error) {
    throw new Error("Error downloading files");
  }
};
export const handleZipFileDownload = async (
  filenames: string[]
) => {
  try {
    const queryParams = new URLSearchParams();
    filenames.forEach((filename) => queryParams.append("filenames", filename));
    const axiosClient = getAxiosClient()
    const response = await axiosClient.get(`${GNOSIS_API_URL}/upload/download/zip/`, {
      params: queryParams,
      responseType: "blob",
    });
    const result = {
      response: response,
      fileName: `files_${new Date().toISOString()}.zip`,
    };
    return result;
  } catch (error) {
    throw new Error("Error downloading files");
  }
};

/*----------------------------------------------------- 
  ---------- Handle download file with URL
  ----------------------------------------------------- */
export const downloadFileWithUrl = (urlDownload: string, fileName: string) => {
  const url = window.URL.createObjectURL(new Blob([urlDownload]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
