import { Link, useLocation } from "react-router-dom";
import { IoSearch } from "react-icons/io5";
import { assets } from "../../assets/assets";
import Navigate from "./Navigate";
import {
  deleteGoogleLoginCookies,
  getGoogleLoginCookies,
} from "../../utils/auth/handleCookies";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { clearUserData, setUserData } from "../../redux/slices/userSlice";
import { useEffect } from "react";
import { IUserCookie } from "../../types/User";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../firebaseConfig";

const Header = () => {
  const userData = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const location = useLocation();

  useEffect(() => {
    /*--------------------------------------------
      ----- HANDLE USER LOGOUT/TOKEN EXPIRED -----
      -------------------------------------------- */
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        deleteGoogleLoginCookies();
        dispatch(clearUserData());
      }
    });

    const userData: IUserCookie | null = getGoogleLoginCookies();
    if (userData) {
      dispatch(setUserData(userData));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <div className="fixed top-0 left-0 h-[85px] w-full bg-gnosis-primary-black px-4 flex items-center z-50">
      <div className="h-full w-40 flex aspect-square shrink-0">
        <Link to="/">
          <img
            src={assets.logoGnosis}
            alt="logo-gnosis-1"
            loading="lazy"
            className="h-full w-auto py-2"
          />
        </Link>
      </div>
      <div className="flex-1 flex flex-wrap justify-center items-center gap-5  text-xl font-semibold">
        <Navigate
          colorVisit="text-gnosis-primary-white"
          colorNoneVisit="text-gnosis-primary-blue-th1"
        />
        <div className="h-full w-max flex items-center">
          <div className="text-gnosis-primary-blue-th1 p-2 h-1/2">
            <IoSearch />
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="h-full px-2 py-1 bg-transparent text-gnosis-primary-white font-normal focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gnosis-primary-blue-th1"
          />
        </div>
        <Link to="/login">
          {userData.status ? (
            <span
              className={`text-gnosis-primary-blue-th1 hover:cursor-pointer hover:text-gnosis-primary-white`}
              onClick={handleLogout}
            >
              LOGOUT
            </span>
          ) : (
            <span
              className={`${
                location.pathname === "/login"
                  ? "text-gnosis-primary-white"
                  : "text-gnosis-primary-blue-th1"
              } hover:cursor-pointer`}
            >
              LOGIN
            </span>
          )}
        </Link>

        {userData.status && (
          <span className={`text-gnosis-primary-blue-th1 hover:cursor-pointer`}>
            {userData.username}
          </span>
        )}
      </div>
    </div>
  );
};

export default Header;
