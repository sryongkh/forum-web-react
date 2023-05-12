import React from "react";
import { useNavigate } from "react-router-dom";

import { fetchSelectedTopics } from "../../../api";

import Dialog from "@mui/material/Dialog";

interface topicFormProps {
  isOpen: boolean;
  onRequestClose: () => void;
  topicId: string;
}

const TopicContentDialog: React.FC<topicFormProps> = ({
  isOpen,
  onRequestClose,
  topicId,
}) => {
  // const [open, setOpen] = React.useState(false);
  const [topicData, setTopicData] = React.useState<string[]>([]);

  // const topicContent = topicData.find((data) => data)

  // const navigate = useNavigate();

  React.useEffect(() => {
    
    const fetchAllTopics = async () => {
      const selectedTopicData = await fetchSelectedTopics(topicId);
      setTopicData(selectedTopicData);
      console.log(topicData);
    };
    fetchAllTopics();

    return () => {};
  }, []);

  return (
    <>
      <Dialog
        id="new-topic-dialog"
        open={isOpen}
        onClose={onRequestClose}
        fullScreen
        // TransitionComponent={Transition}
        transitionDuration={500}
        PaperProps={{
          style: {
            borderRadius: "2rem",
            height: "97%",
            width: "97%",
            margin: "auto",
          },
        }}
      >
        <div id="modal-page">
          {/* <FontAwesomeIcon
            id="close-button"
            icon={faXmark}
            onClick={onRequestClose}
          /> */}
          <form>
            <div className="flex">Test</div>
            {/* <div id="submit-button" className="fixed right-8 bottom-4">
              <button
                id="btn-new-topic"
                className="h-14 px-5 rounded-md font-bold text-white"
                style={{ backgroundColor: "var(--redPantone)" }}
                type="submit"
              >
                Create Post
              </button>
            </div> */}
          </form>
        </div>
      </Dialog>
    </>
  );
};

export default TopicContentDialog;
