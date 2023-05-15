import React from "react";
import { useNavigate } from "react-router-dom";
import Parser from "html-react-parser";

import "./topicContentDialog.css";
import { fetchSelectedTopic, getProfileImageURL } from "../../../api";
import ReplyDialog from "./replyBox/replyBox";

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
  const [profileImageURL, setProfileImageURL] = React.useState("");

  // const topicContent = topicData.find((data) => data)

  // const navigate = useNavigate();

  const fetchProfileImageURL = async (uid: string) => {
    const imageURL = await getProfileImageURL(uid);
    setProfileImageURL(imageURL);
  };

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
      if (selectedTopicData && selectedTopicData.uid) {
        setTopicData(selectedTopicData);
        fetchProfileImageURL(selectedTopicData.uid);
      } else {
        console.error("Error: selectedTopicData is invalid", selectedTopicData);
        setTopicData(null);
      }
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
              className={`block w-2/6 h-full absolute right-0 bg-white p-4 transition-transform duration-300 ${
                replyOpen
                  ? "transform translate-x-0"
                  : "transform translate-x-full"
              }`}
            >
              {/* เมนูด้านข้าง */}

              {/* Reply Dialog */}
              <ReplyDialog />
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
            <div className="px-10 py-16 flex">
              <div id="topic-content" className="w-3/5 px-10 py-8 rounded-xl">
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
                  <div
                    className="w-10 h-10 mr-2 bg-slate-600 rounded-full"
                    style={{
                      backgroundImage: `url(${profileImageURL})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  ></div>
                  <p>{topicData?.displayName}</p>
                </div>
                <div id="topic-body" className="mt-8 text-sm font-medium">
                  {topicData?.topicBody && Parser(topicData.topicBody)}
                </div>

                <div className="flex">
                  <div className="flex justify-center items-center bg-slate-700 bg-opacity-25 mt-8 px-3 py-1 rounded-full text-sm font-medium">
                    {topicData?.likeCount}&nbsp;&nbsp;
                    <FontAwesomeIcon
                      icon={isLiked ? fasHeart : farHeart}
                      onClick={handleLikeClick}
                      className="cursor-pointer"
                      style={{ color: isLiked ? "red" : "white" }}
                    />
                  </div>
                  <div className="flex justify-center items-center bg-slate-700 bg-opacity-25 mt-8 ml-2 px-3 py-1 rounded-full text-sm font-medium">
                    <FontAwesomeIcon
                      icon={isBookmark ? fasBookmark : farBookmark}
                      onClick={handleBookmarkClick}
                      className="cursor-pointer"
                      style={{ color: isBookmark ? "" : "white" }}
                    />
                  </div>

                  <div
                    className="flex justify-center items-center bg-slate-700 bg-opacity-25 mt-8 ml-2 px-3 py-1 rounded-full text-sm font-medium cursor-pointer"
                    onClick={handleReplyClick}
                  >
                    <FontAwesomeIcon
                      icon={faReply}
                      style={{ color: "white" }}
                    />
                    &nbsp;&nbsp;Reply
                  </div>
                </div>

                <div className="mt-10 max-w-full">
                  <div className="mt-8 grid grid-cols-4 text-center font-semibold">
                    <div className="">
                      <p className="text-small">REPLY</p>
                      <p>{topicData?.replyList.length}</p>
                    </div>
                    <div className="">
                      <p className="text-small">VIEWS</p>
                      <p>{topicData?.views}</p>
                    </div>
                    <div className="">
                      <p className="text-small">LIKES</p>
                      <p>{topicData?.likeCount}</p>
                    </div>
                    <div className="">
                      <p className="text-small">LAST REPLY</p>
                      <p>None</p>
                    </div>
                  </div>
                  <div className="mt-12 flex">
                    <div className="mr-2 w-10 h-10 bg-red-200 rounded-full" />
                    <div className="mr-2 w-10 h-10 bg-red-300 rounded-full" />
                    <div className="mr-2 w-10 h-10 bg-red-400 rounded-full" />
                    <div className="mr-2 w-10 h-10 bg-red-500 rounded-full" />
                    <div className="mr-2 w-10 h-10 bg-red-600 rounded-full" />
                  </div>
                </div>
              </div>

              {/* Reply Side */}
              <div className="w-full ml-20">
                <ReplyDialog />
              </div>
            </div>
          </form>
        </div>
      </Dialog>
    </>
  );
};

export default TopicContentDialog;
