import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ButtonSubmit from "./components/ButtonSubmit";
import InputField from "./components/InputField";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { toast } from "react-toastify";
import { FirebaseError } from "firebase/app";

const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    const toastId = toast.info("Creating account...");
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Update user profile with display name
      await updateProfile(user, { displayName }).then(() => {
        toast.success("Register successfully");
        navigate("/login"); // Navigate to the login page
      });

      // Clear form fields (optional)
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setDisplayName("");
    } catch (error) {
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/email-already-in-use":
            toast.error("The email address is already in use.");
            break;
          case "auth/weak-password":
            toast.error("The password is too weak.");
            break;
          case "auth/invalid-email":
            toast.error("The email address is invalid.");
            break;
          default:
            toast.error("Failed to register.");
        }
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      toast.dismiss(toastId);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
    } else {
      setPasswordError(null);
    }
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(e.target.value);
  };

  return (
    <div className="h-[calc(100vh-85px)] w-screen bg-gnosis-primary-white">
      <div className="h-max max-h-[95%] w-[400px] max-w-[90vw] px-6 drop-shadow-lg border-2 py-4 bg-gnosis-primary-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 rounded-lg flex flex-col">
        <h1 className="text-2xl font-bold text-center text-indigo-600">
          REGISTER
        </h1>
        <form onSubmit={handleRegister} className="text-indigo-600">
          <InputField
            id="displayName"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            label="First & last name"
            required
          />
          <InputField
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            label="Email"
            required
          />
          <div className="flex items-end gap-4">
            <InputField
              id="password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              label="Password"
              required
            />
            <InputField
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              label="Confirm Password"
              required
            />
          </div>
          <p
            className={`text-red-500 text-center min-h-6 ${
              passwordError ? "visible" : "invisible"
            }`}
          >
            {passwordError || " "}
          </p>
          <ButtonSubmit text="REGISTER" />
        </form>
        <div className="mt-4 text-center font-semibold">
          Already have an account?{" "}
          <Link className="text-indigo-600 hover:underline" to="/login">
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
