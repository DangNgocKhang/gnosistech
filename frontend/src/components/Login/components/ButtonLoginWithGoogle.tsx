import { signInWithPopup } from "firebase/auth";
import { toast } from "react-toastify";
import { assets } from "../../../assets/assets";
import { auth, googleProvider } from "../../../firebaseConfig";
import { setUserData } from "../../../redux/slices/userSlice";
import { IBaseUser, IUserCookie } from "../../../types/User";
import { setGoogleLoginCookies } from "../../../utils/auth/handleCookies";
import { useAppDispatch } from "../../../redux/hook";
import { useLocation, useNavigate } from "react-router-dom";

const ButtonLoginWithGoogle = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();

      const userAuthGoogleLogin: IBaseUser = {
        id: result.user.uid,
        username: result.user.displayName,
      };
      dispatch(setUserData(userAuthGoogleLogin));

      const userLoginCookies: IUserCookie = {
        id: result.user.uid,
        username: result.user.displayName,
        token: token,
      };
      setGoogleLoginCookies(userLoginCookies);

      navigate(from, { replace: true });
    } catch (error) {
      toast.error("Error during Google sign-in");
    }
  };
  return (
    <button
      className="m-auto w-full md:w-full py-2 px-4  border md:border-2 border-gray-400 rounded-md font-semibold text-2xl flex justify-center items-center bg-gnosis-primary-white hover:bg-gnosis-primary-blue-th2 drop-shadow-lg "
      onClick={handleGoogleSignIn}
    >
      <img
        loading="lazy"
        src={assets.iconGoogle}
        alt="iconGoogle"
        title="iconGoogle"
        className="h-8 w-auto mr-2 "
      />
      <span className="text-xl md:font-bold">Login with Google</span>
    </button>
  );
};

export default ButtonLoginWithGoogle;
