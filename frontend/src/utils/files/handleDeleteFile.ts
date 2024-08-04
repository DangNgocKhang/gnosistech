import { GNOSIS_API_URL } from "../../config";
import getAxiosClient from "../../utils/axios/axiosClient";


/* ---------Delete file or multiple files--------- */
export const handleDeleteFile = async (userId: string, filenames: string[]) => {
  const formData = new FormData();
  formData.append("user_id", userId);
  filenames.forEach((file) => formData.append("filenames", file));

  try {
    const axiosClient = getAxiosClient()
    const response = await axiosClient.delete(
      `${GNOSIS_API_URL}/upload/delete_files`,
      {
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.status;
  } catch (error) {
    throw new Error("Delete file unsuccessful"); // Re-throw the error to be caught by the calling function
  }
};
