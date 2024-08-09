import { IListFilesResponse } from "../../types/File";
import { GNOSIS_API_URL } from "../../config";
import getAxiosClient from "../axios/axiosClient";

export async function getListFileWithArrayPath(
  paths: string[]
): Promise<IListFilesResponse> {
  try {
    const queryParams = new URLSearchParams();

    paths.forEach((path) => queryParams.append("paths", path));

    const axiosClient = getAxiosClient();
    const response = await axiosClient.get<IListFilesResponse>(
      `${GNOSIS_API_URL}/file/list-files`,
      {
        params: queryParams 
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching files:", error);
    throw error;
  }
}
