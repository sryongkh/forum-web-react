import React, { useState } from "react";
import Modal from "react-modal";

interface NewTopicModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onSubmit: (name: string, bannerColor: string) => void;
}

const NewTopicModal: React.FC<NewTopicModalProps> = ({
  isOpen,
  onRequestClose,
  onSubmit,
}) => {
  const [name, setName] = useState("");
  const [bannerColor, setBannerColor] = useState("#000000");

  const handleSubmit = () => {
    onSubmit(name, bannerColor);
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
        <h2 className="text-xl font-bold mb-4">Create New Topic</h2>
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Topic name"
          className="w-full"
        />
        <input
          type="color"
          value={bannerColor}
          onChange={(event) => setBannerColor(event.target.value)}
          className="w-full"
        />
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
      </div>
    </Modal>
  );
};

export default NewTopicModal;
