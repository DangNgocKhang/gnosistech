import { GNOSIS_API_URL } from "../../config";
import getAxiosClient from "../axios/axiosClient";

export const handleDownload = async (
  listFilenames: string[],
  listFoldernames: string[],
  paths: string[]
) => {
  try {
    const queryParams = new URLSearchParams();
    listFilenames.forEach((filename) => queryParams.append("file_names", filename));
    listFoldernames.forEach((foldername) => queryParams.append("directory_names", foldername));
    paths.forEach((path) => queryParams.append("paths", path));

    const axiosClient = getAxiosClient()
    const response = await axiosClient.get(`${GNOSIS_API_URL}/file/download`, {
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
