import React, { useRef } from "react";

import "./newTopicForm.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import Dialog from "@mui/material/Dialog";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { Editor } from "@tinymce/tinymce-react";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

interface NewTopicFormProps {
  isOpen: boolean;
  onRequestClose: () => void;
}

const NewTopicForm: React.FC<NewTopicFormProps> = ({
  isOpen,
  onRequestClose,
}) => {
  const [text, setText] = React.useState("");
  const [wordCount, setWordCount] = React.useState(100);
  const [limitExceeded, setLimitExceeded] = React.useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputText = event.target.value;
    const charCount = inputText.length;
    if (charCount <= 100) {
      setText(inputText);
      setWordCount(100 - charCount);
    }
    setLimitExceeded(charCount < 0);
  };

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setLimitExceeded(false);
  };

  return (
    <>
      <Dialog
        id="new-topic-dialog"
        open={isOpen}
        onClose={onRequestClose}
        fullScreen
        TransitionComponent={Transition}
        transitionDuration={500}
        PaperProps={{
          style: {
            borderTopLeftRadius: "8rem",
            borderTopRightRadius: "8rem",
            height: "99%",
            marginTop: "auto",
          },
        }}
      >
        <div id="modal-page">
          <FontAwesomeIcon
            id="close-button"
            icon={faXmark}
            onClick={onRequestClose}
          />
          <div id="data-topic" className="mt-32 px-8">
            <div className="flex flex-col">
              <label className="font-medium" htmlFor="input-topic-title">
                Topics Title
              </label>
              <div className="rounded-md bg-zinc-200 px-4 py-2 flex items-center">
                <input
                  id="input-topic-title"
                  type="text"
                  placeholder="Subject of your topic"
                  className={`w-full bg-transparent`}
                  value={text}
                  onChange={handleInputChange}
                />
                <span className="text-md">{`${wordCount}`}</span>
              </div>
            </div>

            <div className="mt-4 flex flex-col">
              <label className="font-medium" htmlFor="input-topic-category">
                Category
              </label>
              <input
                id="input-topic-category"
                type="text"
                placeholder="Select Category"
                className="rounded-md bg-zinc-200 px-4 py-2"
              />
            </div>

            <div className="mt-4 flex flex-col">
              <label className="font-medium" htmlFor="input-topic-tags">
                Tags
              </label>
              <input
                id="input-topic-tags"
                type="text"
                placeholder="Use comma to seperate tag"
                className="rounded-md bg-zinc-200 px-4 py-2"
              />
            </div>

            <div className="my-4">
              <label htmlFor="input-topic-body">Topics Body</label>
              <Editor
                apiKey="ar3bll71u5ai3pbp02zqh8epqj4guoge5sifne7wmu72mhwl"
                init={{
                  height: 400,
                  menubar: false,
                  plugins: "advlist lists link",
                  toolbar:
                    "undo redo | formatselect | bold italic | \
                    alignleft aligncenter alignright alignjustify | \
                    bullist numlist outdent indent | link",
                }}
              />
            </div>
          </div>
          <div id="submit-button" className="fixed right-8 bottom-4">
            <button
              id="btn-new-topic"
              className="h-14 px-5 rounded-md font-bold text-white"
              style={{ backgroundColor: "var(--redPantone)" }}
              // onClick={handleNewCategoryClick}
            >
              Create Post
            </button>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default NewTopicForm;
