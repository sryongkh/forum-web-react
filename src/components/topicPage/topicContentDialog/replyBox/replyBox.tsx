import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart as fasHeart,
  faBookmark as fasBookmark,
  faReply,
  faChevronUp,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import {
  faHeart as farHeart,
  faBookmark as farBookmark,
} from "@fortawesome/free-regular-svg-icons";

const ReplyDialog = () => {
  const [isLiked, setIsLiked] = React.useState(false);
  const [isBookmark, setIsBookmark] = React.useState(false);
  const [isExpandReply, setIsExpandReply] = React.useState(false);
  const [replyOpen, setReplyOpen] = React.useState(false);
  const [reply, setReply] = React.useState("");

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

  const handleExpandReplyClick = () => {
    setIsExpandReply((prevState: any) => !prevState);
  };

  return (
    <>
      <div className="flex flex-col p-4 bg-white rounded-xl shadow-lg">
        <div className="flex items-center">
          <div className="w-9 h-9 rounded-full bg-slate-800" />
          <div className="flex flex-col ml-3">
            <p className="font-bold">Test</p>
            <p className="text-xs">Date Time</p>
          </div>
        </div>
        <p className="my-3 text-sm font-medium">Hi, so how did you do that</p>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <FontAwesomeIcon
              icon={isExpandReply ? faChevronDown : faChevronUp}
              onClick={handleExpandReplyClick}
              className="cursor-pointer"
            />
            <p className="font-medium">
              &nbsp;<span>0</span>&nbsp;Reply
            </p>
          </div>
          <div className="flex">
            <div className="flex justify-center items-center bg-slate-700 bg-opacity-25 px-3 py-1 rounded-full text-sm font-medium">
              <p>0&nbsp;&nbsp;</p>
              <FontAwesomeIcon
                icon={isLiked ? faChevronDown : faChevronUp}
                onClick={handleLikeClick}
                className="cursor-pointer"
                style={{ color: isLiked ? "red" : "black" }}
              />
            </div>
            <div className="flex justify-center items-center bg-slate-700 bg-opacity-25 ml-2 px-3 py-1 rounded-full text-sm font-medium">
              <FontAwesomeIcon
                icon={isBookmark ? fasBookmark : farBookmark}
                onClick={handleBookmarkClick}
                className="cursor-pointer"
                style={{ color: isBookmark ? "" : "black" }}
              />
            </div>

            <div
              className="flex justify-center items-center bg-slate-700 bg-opacity-25 ml-2 px-3 py-1 rounded-full text-sm font-medium cursor-pointer"
              onClick={handleReplyClick}
            >
              <FontAwesomeIcon icon={faReply} style={{ color: "black" }} />
              &nbsp;&nbsp;Reply
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col mt-4 p-4 bg-gray-100 rounded-xl shadow-lg">Test</div>
    </>
  );
};

export default ReplyDialog;
