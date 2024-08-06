import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ThirdPartyLogin from "./ThirdPartyLogin";
import ButtonSubmit from "./components/ButtonSubmit";
import InputField from "./components/InputField";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { IBaseUser, IUserCookie } from "../../types/User";
import { setUserData } from "../../redux/slices/userSlice";
import { useAppDispatch } from "../../redux/hook";
import { setGoogleLoginCookies } from "../../utils/auth/handleCookies";
import { toast } from "react-toastify";
import { FirebaseError } from "firebase/app";

const Login: React.FC = () => {
  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleLoginCredential = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        userEmail,
        password
      );
      const token = await userCredential.user.getIdToken();

      const userLogin: IBaseUser = {
        id: userCredential.user.uid,
        username: userCredential.user.displayName,
      };

      const userLoginCookies: IUserCookie = {
        token: token,
      };
      dispatch(setUserData(userLogin));
      setGoogleLoginCookies(userLoginCookies);
      navigate(from, { replace: true });
    } catch (error) {
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/invalid-credential":
            toast.error("Invalid credentials. Check your email and password.");
            break;
          case "auth/user-not-found":
            toast.error("No user found with this email.");
            break;
          case "auth/wrong-password":
            toast.error("Incorrect password.");
            break;
          case "auth/invalid-email":
            toast.error("Invalid email address.");
            break;
          case "auth/network-request-failed":
            toast.error("Network error. Check your connection.");
            break;
          default:
            toast.error("An unexpected error occurred.");
        }
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="h-[calc(100vh-85px)] w-screen  bg-gnosis-primary-white">
      <div className="h-max max-h-[95%] w-[400px] max-w-[90vw] lg:w-[400px] px-6 py-4 drop-shadow-lg border-2 bg-gnosis-primary-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 rounded-lg flex flex-col">
        <h1 className="text-2xl font-bold text-center text-indigo-600">
          LOGIN
        </h1>
        <form onSubmit={handleLoginCredential} className=" text-indigo-600">
          <InputField
            id="email"
            type="email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            label="Email"
            required
          />

          <InputField
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            label="Password"
            required
          />

          <ButtonSubmit text="LOGIN" />
        </form>
        <div className="py-4 text-center text-xl font-semibold">
          No account yet?{" "}
          <Link className="text-indigo-600 hover:underline" to="/register">
            Register here
          </Link>
        </div>

        <ThirdPartyLogin />
      </div>
    </div>
  );
};

export default Login;
