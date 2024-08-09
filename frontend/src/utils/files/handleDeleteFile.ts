import { GNOSIS_API_URL } from "../../config";
import getAxiosClient from "../../utils/axios/axiosClient";

/*--------------------------------------------
  --------------- DELETE FILE AND FOLDER --------
  -------------------------------------------- */
export const handleDelete = async (
  listFilenames: string[],
  listFoldernames: string[],
  paths: string[]
) => {
  try {
    const queryParams = new URLSearchParams();
    listFilenames.forEach((filename) =>
      queryParams.append("file_names", filename)
    );
    listFoldernames.forEach((foldername) =>
      queryParams.append("directory_names", foldername)
    );
    paths.forEach((path) => queryParams.append("paths", path));

    const axiosClient = getAxiosClient();
    const response = await axiosClient.delete(`${GNOSIS_API_URL}/file/delete`, {
      params: queryParams,
    });

    return response;
  } catch (error) {
    throw new Error("Error delete files");
  }
};
