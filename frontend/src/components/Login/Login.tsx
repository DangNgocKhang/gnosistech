
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../firebaseConfig";
import { IBaseUser, IUserCookie } from "../../types/User";
import { setGoogleLoginCookies } from "../../utils/auth/handleCookies";
import { useAppDispatch } from "../../redux/hook";
import { setUserData } from "../../redux/slices/userSlice";
import { toast } from "react-toastify";
import { assets } from "../../assets/assets";
import { useLocation, useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/";

  
  const dispatch = useAppDispatch();

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
        token: token,
      };
      setGoogleLoginCookies(userLoginCookies);
      
      navigate(from, { replace: true });

    } catch (error) {
      toast.error("Error during Google sign-in");
    }
  };



  return (
    <div
      className="h-[calc(100vh-85px)] w-screen drop-shadow-lg bg-gnosis-primary-black"
      onClick={() => {
        
      }}
    >
      <div
        className="h-[450px] w-[400px] max-w-[90vw] lg:h-[500px] lg:w-[500px] bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 rounded-lg flex"
        onClick={(event) => {
          event.stopPropagation();
        }}
      >

        <button
          className="m-auto h-max w-max  px-4 py-4 border-2 border-gnosis-primary-black rounded-xl font-bold text-2xl flex items-center bg-gnosis-primary-white hover:bg-gnosis-primary-blue-th2 drop-shadow-lg"
          onClick={handleGoogleSignIn}
        >
          <img
            loading="lazy"
            src={assets.iconGoogle}
            alt="iconGoogle"
            title="iconGoogle"
            className="h-max w-auto mr-2"
          />
          Login with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
