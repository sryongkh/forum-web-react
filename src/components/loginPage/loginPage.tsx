import React, { useState, useEffect } from "react";
import "./loginPage.css";
import RecentLoginButton from "../recentLogin/recentLogin";
import PasswordModal from "../passwordModal/passwordModal";

import { initializeApp } from "firebase/app";

import {
  getAuth,
  AuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  FacebookAuthProvider,
  GoogleAuthProvider,
  TwitterAuthProvider,
} from "firebase/auth";
import type { User } from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

import firebaseConfig from "../../firebase";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

import loginFB from "../../assets/facebook.png";
import loginGG from "../../assets/google.png";
import loginTW from "../../assets/twitter.png";

import { useNavigate } from "react-router-dom";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const LoginPage = ({
  setUserEmail,
}: {
  setUserEmail: (email: string | null) => void;
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [recentLogins, setRecentLogins] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const recentLogin = localStorage.getItem("recentLogin");
    const recentLoginsArray = recentLogin ? [recentLogin] : [];
    setRecentLogins(recentLoginsArray);
  }, []);

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleModalSubmit = async (password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        recentLogins[0],
        password
      );
      const user = userCredential.user;
      if (user) {
        console.log("User logged in:", user.email);
        addRecentLogin(user);
        navigate(`/`);
      }
      setShowModal(false);
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  const addRecentLogin = async (user: User | null) => {
    try {
      if (user && user.email) {
        const docRef = doc(db, "users", user.uid || "");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          const logins = data?.recentLogins || [];
          logins.unshift(user.email);
          if (logins.length > 3) {
            logins.pop();
          }
          await updateDoc(docRef, { recentLogins: logins });
        } else {
          await setDoc(docRef, { recentLogins: [user.email] });
        }
        localStorage.setItem("recentLogins", JSON.stringify([user.email])); // อัพเดตให้เก็บ email เฉพาะครั้งล่าสุด
        setRecentLogins([user.email]); // อัพเดต state เพื่อ render ปุ่มเข้าสู่ระบบล่าสุด
      }
    } catch (error) {
      console.error("Error adding recent login:", error);
    }
  };

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const auth = getAuth(app);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;      
      localStorage.setItem("recentLogin", email);
      await addRecentLogin(user);
      navigate(`/`);
    } catch (error) {
      console.error(error);
    }
  };

  const loginWithProvider = async (provider: AuthProvider) => {
    const auth = getAuth(app);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error(error);
      }
    }
  };

  const handleLoginWithFacebook = () => {
    const provider = new FacebookAuthProvider();
    loginWithProvider(provider);
  };

  const handleLoginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider); // เรียกใช้ signInWithPopup() เพื่อเข้าสู่ระบบด้วยบัญชี Google Account
      const user = result.user; // ดึงข้อมูลผู้ใช้
      console.log("Successfully signed in with Google as:", user.displayName);
      setUser(user); // เปลี่ยน state ของ user เป็นข้อมูลผู้ใช้ที่เข้าสู่ระบบ
      navigate(`/`); // ทำการ redirect ไปยังหน้าแรกของเว็บไซต์
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  const handleLoginWithTwitter = () => {
    const provider = new TwitterAuthProvider();
    loginWithProvider(provider);
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleForgotPasswordClick = () => {
    navigate(`/forgotpassword`);
  };

  const handleSignupClick = () => {
    navigate(`/signup`);
  };

  return (
    <div
      className="my-10 rounded-3xl"
      style={{ backgroundColor: "var(--antiFlashWhite)" }}
    >
      <div className="px-40 py-10">
        <h1 className="text-7xl text-center">Welcome Back</h1>
        <h1 className="text-center">Join the world's largest community</h1>

        <h1 className="font-medium">Recent logins</h1>
        <div className="flex">
          {recentLogins && recentLogins.length > 0 ? (
            <div className="flex">
              {recentLogins.slice(0, 3).map((email: string, index: number) => (
                <RecentLoginButton
                  key={index}
                  email={email}
                  onClick={() => setShowModal(true)}
                />
              ))}
            </div>
          ) : (
            <div>No recent logins.</div>
          )}
        </div>
      </div>
      <hr />
      <div>
        <div className="rounded-3xl mx-18">
          <div className="my-10 px-96 py-10">
            {/* Sign in */}
            <form onSubmit={handleSignIn}>
              <div className="h-14 grid grid-cols-2 w-full items-end">
                <div
                  className="bg-white mr-4 h-14 pl-4 w-full rounded-md border-2 flex"
                  id="username"
                >
                  <input
                    id="input-username"
                    type="text"
                    className="w-full rounded-md"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="bg-white ml-4 h-14 pl-4 w-full rounded-md border-2 flex">
                  <input
                    id="input-password"
                    type={showPassword ? "text" : "password"}
                    className="w-full"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <span
                    className="relative flex items-center justify-center cursor-pointer"
                    onClick={handleShowPassword}
                  >
                    {showPassword ? (
                      <FontAwesomeIcon
                        icon={faEyeSlash}
                        style={{ color: "var(--spaceCadet)" }}
                        className="mr-2"
                      />
                    ) : (
                      <FontAwesomeIcon
                        icon={faEye}
                        style={{ color: "var(--spaceCadet)" }}
                        className="mr-2"
                      />
                    )}
                  </span>
                </div>
              </div>
              <div className="h-14 grid grid-cols-2 w-full items-center">
                <div className="flex">
                  <input type="checkbox" id="myCheckbox" />
                  <label htmlFor="myCheckbox" className="items-center ml-2">
                    Remember for 30 days
                  </label>
                </div>
                <a
                  className="ml-4 underline cursor-pointer"
                  onClick={handleForgotPasswordClick}
                >
                  Forgot password
                </a>
              </div>
              <div className="grid justify-center items-center">
                <button
                  id="btn-sign-in"
                  type="submit"
                  className="h-14 w-96 rounded-lg grid justify-center items-center font-bold text-white"
                >
                  <p>Sign in</p>
                </button>
              </div>
            </form>
            {/* Sign up */}
            <div className="mt-4 grid justify-center items-center">
              <button
                id="btn-sign-up"
                className="h-14 w-96 rounded-lg grid justify-center items-center font-bold text-white"
                onClick={handleSignupClick}
              >
                <p>Create New Account</p>
              </button>
            </div>
            <div className="mt-4">
              <div className="h-14 grid grid-cols-3 items-center">
                <hr />
                <p className="text-center text-md font-bold">
                  Or continue with
                </p>
                <hr />
              </div>
            </div>
            <div className="flex justify-center items-center">
              <img
                src={loginFB}
                className="h-11 w-11 mx-8 cursor-pointer"
                onClick={handleLoginWithFacebook}
              />
              <img
                src={loginGG}
                className="h-11 w-11 mx-8 cursor-pointer"
                onClick={handleLoginWithGoogle}
              />
              <img
                src={loginTW}
                className="h-11 w-11 mx-8 cursor-pointer"
                onClick={handleLoginWithTwitter}
              />
            </div>
          </div>
        </div>
      </div>
      <PasswordModal
        open={showModal}
        onClose={handleModalClose}
        onLogin={handleModalSubmit}
      />
    </div>
  );
};

export default LoginPage;
