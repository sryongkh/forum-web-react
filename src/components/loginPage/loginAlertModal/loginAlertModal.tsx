import React from "react";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";

import LoginFirst from "../../../assets/login_before.jpg";
import "./loginAlertModal.css";

interface NewCategoryModalProps {
  isAlertOpen: boolean;
}

const LoginAlertModal: React.FC<NewCategoryModalProps> = ({ isAlertOpen }) => {
  const navigate = useNavigate();
  const handleToLoginPage = () => {
    navigate(`/login`);
  };

  return (
    <Modal
      isOpen={isAlertOpen}
      className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50"
      style={{
        overlay: {
          zIndex: 1000,
        },
      }}
    >
      <div className="bg-white rounded-lg p-8 max-w-3xl">
        <h2 className="text-xl font-bold mb-4">You're not login.</h2>
        <div className="flex">
          <img src={LoginFirst} className="w-1/2" />
          <div className="w-1/2 my-4 flex flex-col">
            <p>Please, login before.</p>
            <button
              id="navigate-to-login"
              onClick={handleToLoginPage}
              className="text-white w-full h-10 my-2 p-2 rounded-md mt-auto"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default LoginAlertModal;
