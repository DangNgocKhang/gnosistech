import axios, { AxiosInstance } from "axios";
import { getGoogleLoginCookies } from "../auth/handleCookies";

const getAxiosClient = (): AxiosInstance => {
  const cookies = getGoogleLoginCookies();
  return axios.create({
    headers: {
      Authorization: `Bearer ${cookies?.token}`,
    },
  });
};

export default getAxiosClient;
