import React, { useState } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { initializeApp } from "firebase/app";
import firebaseConfig from "../../../firebase";

// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const app = initializeApp(firebaseConfig);

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [showReEnterPassword, setShowReEnterPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSendPasswordResetEmail = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const auth = getAuth(app);
    sendPasswordResetEmail(auth, email)
      .then(() => {
        console.log("Email sent successfully");
      })
      .catch((error) => {
        console.error("Error sending email:", error);
      });
  };

  return (
    <div
      className="rounded-3xl"
      style={{ backgroundColor: "var(--antiFlashWhite)" }}
    >
      <div className="my-10 px-96 py-10">
        <h1 className="text-4xl font-bold mb-4">Forgot Password</h1>
        <form onSubmit={handleSendPasswordResetEmail}>
          <div className="mb-4">
            <label className="block font-bold mb-2" htmlFor="email">
              Email
            </label>
            <div
              className="bg-white h-14 pl-4 w-full rounded-md border-2 flex"
              id="data-input"
            >
              <input
                className="w-full rounded-md"
                type="email"
                id="email"
                placeholder="Email"
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            {/* <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="email"
              id="email"
              placeholder="Email"
              onChange={(event) => setEmail(event.target.value)}
            /> */}
          </div>
          <div className="mt-4 grid justify-center">
            <button
              id="btn-sign-up"
              className="h-14 w-96 rounded-lg grid items-center font-bold text-white"
              type="submit"
            >
              <p>Send Email</p>
            </button>
          </div>
          {/* <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Send Email
          </button> */}
        </form>
        {/* <form onSubmit={handleResetPassword}>
          <p className="w-full font-medium">New password</p>
          <div
            className="bg-white h-14 pl-4 w-full rounded-md border-2 flex"
            id="data-input"
          >
            <input
              type={showPassword ? "text" : "password"}
              className="w-full rounded-md"
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

          <p className="w-full font-medium">Re-enter new password</p>
          <div
            className="bg-white h-14 pl-4 w-full rounded-md border-2 flex"
            id="data-input"
          >
            <input
              type={showReEnterPassword ? "text" : "password"}
              className="w-full rounded-md"
            />
            <span
              className="relative flex items-center justify-center cursor-pointer"
              onClick={handleShowReEnterPassword}
            >
              {showReEnterPassword ? (
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

          <div className="mt-4 grid justify-center items-center">
            <button
              id="btn-sign-up"
              className="h-14 w-96 rounded-lg grid justify-center items-center font-bold text-white"
            >
              <p>Reset Password</p>
            </button>
          </div>
        </form> */}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
