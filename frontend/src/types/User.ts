export interface IBaseUser {
  id: string;
  username: string | null;
  status?: boolean; //True is user Online - False is user Offline
}
export interface IUserCookie extends IBaseUser {
  token: string
}
