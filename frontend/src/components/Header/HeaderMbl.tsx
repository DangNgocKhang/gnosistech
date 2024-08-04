import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { PiListBold } from "react-icons/pi";
import { IoClose, IoSearch } from "react-icons/io5";
import NavigateMbl from "./NavigateMbl";
import { assets } from "../../assets/assets";
import { deleteGoogleLoginCookies } from "../../utils/auth/handleCookies";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { clearUserData } from "../../redux/slices/userSlice";

const HeaderMbl = () => {
  const [isOpenCategory, setIsOpenCategory] = useState<boolean>(false);
  const divMenuHeaderRef = useRef<HTMLDivElement>(null);
  const userData = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const handleClickOpenCategory = () => {
    setIsOpenCategory(true);
  };
  const handleClickOutside = (event: MouseEvent) => {
    if (
      divMenuHeaderRef.current &&
      !divMenuHeaderRef.current.contains(event.target as Node)
    ) {
      setIsOpenCategory(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    deleteGoogleLoginCookies();
    dispatch(clearUserData());
  };

  return (
    <div className="fixed top-0 left-0 h-[85px] w-full bg-gnosis-primary-black px-0 md:px-4 flex items-center z-50">
      <Link to="/">
        <img
          src={assets.logoGnosis}
          alt="logo-gnosis-1"
          loading="lazy"
          className="h-[80px] w-auto py-4 md:py-2 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        />
      </Link>
      <div className="h-full w-full flex justify-between items-center">
        <PiListBold
          className="h-3/5 w-auto p-1 md:p-4 text-gnosis-primary-blue-th1"
          onClick={handleClickOpenCategory}
        />

        <div className="h-max w-max font-semibold text-gnosis-primary-blue-th1 mr-2 text-xl">
          {userData.status && "Welcome"}
        </div>
      </div>

      <div
        className={`${
          !isOpenCategory ? "invisible" : "visible"
        } h-screen w-80 px-5 bg-gnosis-gray-th1 absolute top-0 left-0 flex flex-col gap-5 text-xl font-semibold `}
        ref={divMenuHeaderRef}
      >
        <div
          className="h-max w-full pt-4 flex  items-center"
          onClick={() => {
            setIsOpenCategory(false);
          }}
        >
          <IoClose className="h-10 w-auto" />
        </div>
        <div className="h-20 w-full flex items-center">
          <input
            type="text"
            placeholder="Search..."
            className="h-1/2 p-2 rounded-l-sm w-full box-border focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gnosis-primary-blue-th1"
          />
          <div className="bg-gnosis-primary-blue-th1 p-2 h-1/2 rounded-r-sm ">
            <IoSearch />
          </div>
        </div>
        <hr />
        <NavigateMbl
          colorVisit="text-gnosis-primary-blue-th1"
          colorNoneVisit="text-gnosis-primary-black"
        />
        <Link to="/login">
          {userData.status ? (
            <span
              className={`text-gnosis-primary-black`}
              onClick={() => {
                setIsOpenCategory(false);
                handleLogout();
              }}
            >
              LOGOUT
            </span>
          ) : (
            <span
              className={`text-gnosis-primary-black`}
            >
              LOGIN
            </span>
          )}
        </Link>
      </div>
    </div>
  );
};

export default HeaderMbl;
