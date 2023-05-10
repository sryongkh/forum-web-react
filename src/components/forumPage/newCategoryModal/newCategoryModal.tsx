import React, { useState } from "react";
import Modal from "react-modal";
import { CirclePicker } from "react-color";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import axios from "axios";

interface NewCategoryModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onSubmit: (name: string, bannerColor: string) => void;
}

const NewCategoryModal: React.FC<NewCategoryModalProps> = ({
  isOpen,
  onRequestClose,
  onSubmit,
}) => {
  const [name, setName] = useState("");
  const [bannerColor, setBannerColor] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);

  const handleSubmit = async () => {
    if (!name || !bannerColor.trim()) {
      setAlertOpen(true);
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/categories/${name}`);
      if (response.data) {
        setAlertOpen(true);
        return;
      }
      onSubmit(name, bannerColor);
      setName("");
    } catch (err) {
      console.error("Error from newCategoryModal.tsx => ", err);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50"
      style={{
        overlay: {
          zIndex: 1000,
        },
      }}
    >
      <div className="bg-white rounded-lg p-8 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Create New Categories</h2>
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Categories name"
          className="w-full"
        />

        <div className="w-full my-4">
          <p>Banner Color</p>
          <div className="flex justify-center items-center my-2">
            <CirclePicker
              color={bannerColor}
              onChange={(color) => setBannerColor(color.hex)}
            />
          </div>
        </div>
        <div>
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Submit
          </button>
          <button
            onClick={onRequestClose}
            className="ml-4 text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
        </div>
        <Snackbar
          open={alertOpen}
          autoHideDuration={3000}
          onClose={() => setAlertOpen(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity="error" style={{ borderRadius: "8px" }}>
            {name && bannerColor
              ? "Categories name already exists. Please enter a different name."
              : !name && !bannerColor
              ? "Please enter category name and choose a banner color."
              : !bannerColor
              ? "Please choose a banner color."
              : "Categories name already exists. Please enter a different name."}
          </Alert>
        </Snackbar>
      </div>
    </Modal>
  );
};

export default NewCategoryModal;
