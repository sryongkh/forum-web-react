import React from "react";
import { useNavigate } from "react-router-dom";
import Parser from "html-react-parser";

import "./topicContentDialog.css";
import { fetchSelectedTopic } from "../../../api";

import Dialog from "@mui/material/Dialog";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
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
  // const [open, setOpen] = React.useState(false);
  const [topicData, setTopicData] = React.useState<TopicData | null>(null);
  const [isLiked, setIsLiked] = React.useState(false);
  const [isBookmark, setIsBookmark] = React.useState(false);
  // const topicContent = topicData.find((data) => data)

  // const navigate = useNavigate();
  const handleLikeClick = () => {
    setIsLiked((prevState: any) => !prevState);
  };

  const handleBookmarkClick = () => {
    setIsBookmark((prevState: any) => !prevState);
  };

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
        <div id="topic-page">
          <FontAwesomeIcon
            id="close-topic-button"
            icon={faXmark}
            onClick={onRequestClose}
          />
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
                <p
                  id="topic-author"
                  className="mt-8 text-md font-medium text-white"
                >
                  {topicData?.displayName}
                </p>
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
                  <div className="flex justify-center items-center bg-slate-700 bg-opacity-25 mt-8 ml-2 px-3 py-1 rounded-full text-sm font-medium">
                    <FontAwesomeIcon
                      icon={faReply}
                      // onClick={handleBookmarkClick}
                      className="cursor-pointer"
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

              <div className="w-full ml-24">
                <h1>No Reply</h1>
              </div>
            </div>
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
