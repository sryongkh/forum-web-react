import React from "react";
import { User, getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import firebaseConfig from "../../../../firebase";

import { Editor } from "@tinymce/tinymce-react";
import Checkbox from "@mui/material/Checkbox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReply } from "@fortawesome/free-solid-svg-icons";

import { createThread } from "../../../../api";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

interface ReplyDialogProps {
  topicTitle?: string;
  handleReplyClickClose: () => void;
  handleSubmitReply: (
    replyContext: string,
    uid: string,
    displayName: string,
    datePost: string,
    timePost: string
  ) => void;
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const ReplyDialog: React.FC<ReplyDialogProps> = ({
  topicTitle,
  handleReplyClickClose,
  handleSubmitReply,
}) => {
  const [currentUser, setCurrentUser] = React.useState<User | null>(null);
  const [replyContext, setReplyContext] = React.useState("");

  const handleEditorChange = (content: string) => {
    setReplyContext(content);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    const datePost = new Date().toLocaleDateString();
    const timePost = new Date().toLocaleTimeString();

    if (currentUser) {
      console.log("handleSubmit called");
      handleSubmitReply(
        replyContext,
        currentUser.uid,
        currentUser.displayName || "",
        datePost,
        timePost
      );
    }
  };

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log(user);
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <>
      <form onSubmit={handleSubmit} className="px-5 mt-14">
        <div className="flex">
          <div className="w-8 h-8 p-5 flex justify-center items-center border rounded-sm">
            <FontAwesomeIcon
              icon={faReply}
              className="text-lg"
              style={{ color: "var(--fireEngineRed)" }}
            />
          </div>
          <div className="px-5 font-extrabold">
            <p>{topicTitle}</p>
          </div>
        </div>
        <div className="mt-5">
          <Editor
            apiKey="ar3bll71u5ai3pbp02zqh8epqj4guoge5sifne7wmu72mhwl"
            init={{
              height: 300,
              menubar: false,
              plugins: "advlist lists link",
              toolbar:
                "undo redo | formatselect | bold italic | \
      alignleft aligncenter alignright alignjustify | \
      bullist numlist outdent indent | link",
            }}
            onEditorChange={handleEditorChange}
          />
          <div className="w-full absolute bottom-6 right-5 text-end">
            <button
              id="btn-new-category"
              className="h-14 px-5 rounded-md font-bold"
              style={{ backgroundColor: "var(--antiFlashWhite)" }}
              type="button" // specify type="button" to prevent it from submitting the form
              onClick={handleReplyClickClose}
            >
              Cancel
            </button>
            <button
              id="btn-new-category"
              type="submit"
              className="h-14 ml-3 px-5 rounded-md font-bold"
              style={{
                backgroundColor: "var(--fireEngineRed)",
                color: "var(--antiFlashWhite)",
              }}
              onClick={handleSubmit}
            >
              Add Message
            </button>
          </div>
        </div>
        <div className="mt-3 flex items-center">
          <Checkbox
            {...label}
            className="w-0 h-0"
            sx={{
              color: "var(--fireEngineRed)",
              "&.Mui-checked": {
                color: "var(--fireEngineRed)",
              },
            }}
          />
          &nbsp;&nbsp;
          <p className="text-sm">Notify me when a reply is posted</p>
        </div>

        <div className="w-full absolute bottom-6 right-5 text-end">
          <button
            id="btn-new-category"
            className="h-14 px-5 rounded-md font-bold"
            style={{ backgroundColor: "var(--antiFlashWhite)" }}
            onClick={handleReplyClickClose}
          >
            Cancel
          </button>
          <button
            id="btn-new-category"
            type="submit"
            className="h-14 ml-3 px-5 rounded-md font-bold"
            style={{
              backgroundColor: "var(--fireEngineRed)",
              color: "var(--antiFlashWhite)",
            }}
          >
            Add Message
          </button>
        </div>
      </form>
    </>
  );
};

export default ReplyDialog;
