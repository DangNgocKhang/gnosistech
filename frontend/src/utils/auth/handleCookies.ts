import Cookies from "universal-cookie";
import { IUserCookie } from "../../types/User";

const cookies = new Cookies();

export const setGoogleLoginCookies = (userData: IUserCookie): void => {
  cookies.set("userLoginGoogle", userData, { path: "/" });
};

export const getGoogleLoginCookies = (): IUserCookie | null => {
  const cookiesResult = cookies.get("userLoginGoogle");
  if (!cookiesResult) return null;
  return cookiesResult;
};

export const deleteGoogleLoginCookies = (): void => {
  cookies.remove("userLoginGoogle", { path: "/" });
};
