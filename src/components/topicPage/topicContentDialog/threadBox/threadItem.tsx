import React from "react";
import Parser from "html-react-parser";

import ReplyDialog from "../replyDialog/replyDialog";
import { addReply } from "../../../../api";

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

import Collapse from "@mui/material/Collapse";

type Thread = {
  _id: string;
  topicId: string;
  displayName: string;
  datePost: string;
  timePost: string;
  content: string;
};

interface ThreadItemProps {
  thread: Thread;
  handleReplyClick: (displayName: string, threadId: string) => void;
}

const ThreadItem: React.FC<ThreadItemProps> = ({
  thread,
  handleReplyClick,
}) => {
  const sideMenuRef = React.useRef<HTMLDivElement | null>(null);
  const [isLiked, setIsLiked] = React.useState(false);
  const [isBookmark, setIsBookmark] = React.useState(false);
  const [isExpandReply, setIsExpandReply] = React.useState(false);
  const [replyOpen, setReplyOpen] = React.useState(false);

  const handleLikeClick = () => {
    setIsLiked((prevState: any) => !prevState);
  };

  const handleBookmarkClick = () => {
    setIsBookmark((prevState: any) => !prevState);
  };

  const handleExpandReplyClick = () => {
    setIsExpandReply((prevState: any) => !prevState);
  };

  const handleThreadReplyClick = () => {
    setReplyOpen((prevState: any) => !prevState);
  };

  const handleThreadReplySubmit = (
    replyContext: string,
    uid: string,
    displayName: string,
    datePost: string,
    timePost: string
  ) => {
    if (thread?._id)
      addReply(thread?._id, replyContext, uid, displayName, datePost, timePost);
    setReplyOpen(false);
  };

  const handleReplyClickClose = React.useCallback(() => {
    setReplyOpen(false);
  }, []);

  return (
    <>
      <Collapse in={replyOpen}>
        <div
          id="side-menu-bg"
          className={`overflow-hidden absolute inset-0 block w-full h-full transition-opacity duration-300 ${
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
            {replyOpen && (
              <ReplyDialog
                target={thread?.displayName}
                handleReplyClickClose={handleReplyClickClose}
                handleSubmitReply={handleThreadReplySubmit}
              />
            )}
          </div>
        </div>
      </Collapse>
      <div className="flex flex-col mb-4 p-4 bg-white rounded-xl shadow-lg">
        <div className="flex items-center">
          <div className="w-9 h-9 rounded-full bg-slate-800" />
          <div className="flex flex-col ml-3">
            <p className="font-bold">{thread.displayName}</p>
            <div className="flex">
              <p className="text-xs mr-1">{thread.datePost}</p>
              <p className="text-xs">{thread.timePost}</p>
            </div>
          </div>
        </div>
        <div className="my-3 text-sm font-medium">
          {thread?.content && Parser(thread.content)}
        </div>
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
                icon={isLiked ? fasHeart : farHeart}
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
              onClick={handleThreadReplyClick}
            >
              <FontAwesomeIcon icon={faReply} style={{ color: "black" }} />
              &nbsp;&nbsp;Reply
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ThreadItem;
