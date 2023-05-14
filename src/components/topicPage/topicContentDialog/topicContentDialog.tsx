import React from "react";
import { useNavigate } from "react-router-dom";
import Parser from "html-react-parser";

import "./topicContentDialog.css";
import { fetchSelectedTopic } from "../../../api";

import Dialog from "@mui/material/Dialog";
import Collapse from "@mui/material/Collapse";
import Checkbox from "@mui/material/Checkbox";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Editor } from "@tinymce/tinymce-react";
import {
  faXmark,
  faHeart as fasHeart,
  faBookmark as fasBookmark,
  faReply,
} from "@fortawesome/free-solid-svg-icons";
import {
  faHeart as farHeart,
  faBookmark as farBookmark,
} from "@fortawesome/free-regular-svg-icons";

const label = { inputProps: { "aria-label": "Checkbox demo" } };
interface topicFormProps {
  isOpen: boolean;
  onRequestClose: () => void;
  topicId: string;
}

interface TopicData {
  _id: string;
  uid: string;
  displayName: string;
  datePost: string;
  timePost: string;
  tagName: string[];
  categoryName: string;
  topicTitle: string;
  topicBody: string;
  likeCount: number;
  views: number;
  replyList: string[];
}

const TopicContentDialog: React.FC<topicFormProps> = ({
  isOpen,
  onRequestClose,
  topicId,
}) => {
  const sideMenuRef = React.useRef<HTMLDivElement | null>(null);

  const [topicData, setTopicData] = React.useState<TopicData | null>(null);
  const [isLiked, setIsLiked] = React.useState(false);
  const [isBookmark, setIsBookmark] = React.useState(false);
  const [replyOpen, setReplyOpen] = React.useState(false);
  const [reply, setReply] = React.useState("");

  // const topicContent = topicData.find((data) => data)

  // const navigate = useNavigate();
  const handleEditorChange = (content: string) => {
    setReply(content);
  };

  const handleLikeClick = () => {
    setIsLiked((prevState: any) => !prevState);
  };

  const handleBookmarkClick = () => {
    setIsBookmark((prevState: any) => !prevState);
  };

  const handleReplyClick = () => {
    setReplyOpen((prevState: any) => {
      const newState = !prevState;
      return newState;
    });
  };

  const handleReplyClickClose = React.useCallback(() => {
    setReplyOpen(false);
  }, []);

  React.useEffect(() => {
    const fetchSelectedTopicData = async () => {
      const selectedTopicData = await fetchSelectedTopic(topicId);
      setTopicData(selectedTopicData);
    };

    if (isOpen) {
      fetchSelectedTopicData();
    } else {
      setTopicData(null);
    }
  }, [isOpen, topicId]);

  return (
    <>
      <Dialog
        id="new-topic-dialog"
        open={isOpen}
        onClose={onRequestClose}
        fullScreen
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
        <Collapse in={replyOpen}>
          <div
            id="side-menu-bg"
            className={`overflow-hidden absolute block w-full h-full transition-opacity duration-300 ${
              replyOpen ? "bg-gray-400 bg-opacity-40" : "bg-transparent"
            }`}
          >
            <div
              ref={sideMenuRef}
              id="side-menu"
              className={`block w-2/5 h-full absolute right-0 bg-white p-4 transition-transform duration-300 ${
                replyOpen
                  ? "transform translate-x-0"
                  : "transform translate-x-full"
              }`}
            >
              {/* เมนูด้านข้าง */}

              {/* Text Editor */}
              <div className="px-5 mt-14">
                <div className="flex">
                  <div className="w-8 h-8 p-5 flex justify-center items-center border rounded-sm">
                    <FontAwesomeIcon
                      icon={faReply}
                      className="text-lg"
                      style={{ color: "var(--fireEngineRed)" }}
                    />
                  </div>
                  <div className="px-5 font-extrabold">
                    <p>{topicData?.topicTitle}</p>
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
                    className="h-14 ml-3 px-5 rounded-md font-bold"
                    style={{
                      backgroundColor: "var(--fireEngineRed)",
                      color: "var(--antiFlashWhite)",
                    }}
                    // onClick={}
                  >
                    Add Message
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Collapse>

        <div id="topic-page">
          <FontAwesomeIcon
            id="close-topic-button"
            icon={faXmark}
            onClick={onRequestClose}
          />
          {/* Reply */}

          <form>
            {/* {topicData.displayName} */}
            <div className="px-10 py-16 flex flex-auto">
              <div
                id="topic-content"
                className="w-3/5 px-10 py-8 bg-blue-400 rounded-xl"
              >
                <p
                  id="topic-title"
                  className="text-3xl font-semibold text-white"
                >
                  {topicData?.topicTitle}
                </p>
                <div
                  id="topic-author"
                  className=" flex items-center mt-8 text-md font-medium text-white"
                >
                  <div className="w-10 h-10 mr-2 bg-slate-600 rounded-full"></div>
                  <p>{topicData?.displayName}</p>
                </div>
                <div id="topic-body" className="mt-8 text-sm font-medium">
                  {topicData?.topicBody && Parser(topicData.topicBody)}
                </div>

                <div className="flex">
                  <div className="flex justify-center items-center bg-slate-700 bg-opacity-25 mt-8 px-3 py-1 rounded-full text-sm font-medium">
                    {topicData?.likeCount}&nbsp;
                    <FontAwesomeIcon
                      icon={isLiked ? fasHeart : farHeart}
                      onClick={handleLikeClick}
                      className="cursor-pointer"
                      style={{ color: isLiked ? "red" : "black" }}
                    />
                  </div>
                  <div className="flex justify-center items-center bg-slate-700 bg-opacity-25 mt-8 ml-2 px-3 py-1 rounded-full text-sm font-medium">
                    <FontAwesomeIcon
                      icon={isBookmark ? fasBookmark : farBookmark}
                      onClick={handleBookmarkClick}
                      className="cursor-pointer"
                      style={{ color: isBookmark ? "" : "black" }}
                    />
                  </div>

                  <div
                    className="flex justify-center items-center bg-slate-700 bg-opacity-25 mt-8 ml-2 px-3 py-1 rounded-full text-sm font-medium cursor-pointer"
                    onClick={handleReplyClick}
                  >
                    <FontAwesomeIcon
                      icon={faReply}
                      style={{ color: "black" }}
                    />
                    &nbsp;Reply
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-4 text-center font-semibold">
                  <div className="">
                    <p className="text-xs">REPLY</p>
                    <p>{topicData?.replyList.length}</p>
                  </div>
                  <div className="">
                    <p className="text-xs">VIEWS</p>
                    <p>{topicData?.views}</p>
                  </div>
                  <div className="">
                    <p className="text-xs">LIKES</p>
                    <p>{topicData?.likeCount}</p>
                  </div>
                  <div className="">
                    <p className="text-xs">LAST REPLY</p>
                    <p>{topicData?.replyList}</p>
                  </div>
                </div>
              </div>

              {/* Right Side */}
              <div className="w-full ml-24">
                <h1>No Reply</h1>
              </div>
            </div>
          </form>
        </div>
      </Dialog>
    </>
  );
};

export default TopicContentDialog;
