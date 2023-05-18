import React from "react";
import Parser from "html-react-parser";

interface replyThreadProps {
  replies: ReplyData[];
}

type ReplyData = {
  _id: string;
  threadId: string;
  displayName: string;
  datePost: string;
  timePost: string;
  content: string;
};

const ReplyThread: React.FC<replyThreadProps> = ({ replies }) => {
  React.useEffect(() => {
    console.log(replies);
  });

  return (
    <>
      {replies.map((reply) => (
        <div
          key={reply._id}
          className="flex flex-col mb-4 p-4 border-2 border-gray-300 bg-gray-100 rounded-xl shadow-lg"
        >
          <div className="flex items-center">
            <div className="w-9 h-9 rounded-full bg-slate-800" />
            <div className="flex flex-col ml-3">
              <p className="font-bold">{reply.displayName}</p>
            </div>
          </div>
          <div className="text-sm ml-12 mb-3 font-medium">
            {reply?.content && Parser(reply.content)}
          </div>
          <div className="flex ml-12 text-xs">
            <p className="">{reply.datePost}</p>
            <p className="mx-2">Like</p>
          </div>
        </div>
      ))}
    </>
  );
};

export default ReplyThread;
