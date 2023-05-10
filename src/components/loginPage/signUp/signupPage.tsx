import { useState } from "react";

import "./signUpPage.css";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
// import { MongoClient } from "mongodb";
import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const SignupPage: React.FC = () => {
  const navigate = useNavigate();

  const [showReEnterPassword, setShowReEnterPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const auth = getAuth();
  const MONGODB_URI = "mongodb://localhost:27017";

  const handleShowReEnterPassword = () => {
    setShowReEnterPassword(!showReEnterPassword);
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSignup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      navigate(`/login`);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error(error);
      }
    }
  };

  return (
    <div
      className="my-10 rounded-3xl"
      style={{ backgroundColor: "var(--antiFlashWhite)" }}
    >
      <div className="rounded-3xl mx-18">
        <form onSubmit={handleSignup}>
          <div className="my-10 px-96 py-10">
            <div className="flex">
              <p className="w-full font-medium">Name</p>
              <p className="w-full ml-2 font-medium">Username</p>
            </div>
            <div className="flex">
              {/* Name */}
              <div
                className="bg-white h-14 pl-4 mr-2 w-full rounded-md border-2 flex"
                id="data-input"
              >
                <input
                  id="user-name"
                  type="text"
                  className="w-full rounded-md"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              {/* Username */}
              <div
                className="bg-white h-14 pl-4 ml-2 w-full rounded-md border-2 flex"
                id="data-input"
              >
                <input
                  id="user-username"
                  type="text"
                  className="w-full rounded-md"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>
            </div>

            <p className="w-full font-medium">Email</p>
            <div
              className="bg-white h-14 pl-4 w-full rounded-md border-2 flex"
              id="data-input"
            >
              <input
                id="user-email"
                type="text"
                className="w-full rounded-md"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <p className="w-full font-medium">New password</p>
            <div
              className="bg-white h-14 pl-4 w-full rounded-md border-2 flex"
              id="data-input"
            >
              <input
                id="user-password"
                type={showPassword ? "text" : "password"}
                className="w-full rounded-md"
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

            <p className="w-full font-medium">Re-enter new password</p>
            <div
              className="bg-white h-14 pl-4 w-full rounded-md border-2 flex"
              id="data-input"
            >
              <input
                id="user-repassword"
                type={showReEnterPassword ? "text" : "password"}
                className="w-full rounded-md"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                <p>Create New Account</p>
              </button>
            </div>
            {error && <p>{error}</p>}
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
