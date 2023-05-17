import React from "react";

import { getThreads } from "../../../../api";
import ThreadItem from "./threadItem";

type Thread = {
  _id: string;
  topicId: string;
  displayName: string;
  datePost: string;
  timePost: string;
  content: string;
};

interface ReplyBoxProps {
  topicId: string | undefined;
}

const ReplyBox: React.FC<ReplyBoxProps> = ({ topicId }) => {
  const [threadsData, setThreadsData] = React.useState<Thread[]>([]);

  React.useEffect(() => {
    const fetchThreads = async () => {
      const data = await getThreads();
      if (Array.isArray(data.threads)) {
        setThreadsData(data.threads);
      }
    };

    fetchThreads();
  }, []);

  return (
    <>
      {threadsData.length > 0 ? (
        threadsData
          .filter((thread) => thread?.topicId === topicId)
          .map((thread) => <ThreadItem key={thread._id} thread={thread} />)
      ) : (
        <div>Test</div>
      )}

      {/*If Have Reply*/}
      <div className="flex flex-col mt-4 p-4 border-2 border-gray-300 bg-gray-100 rounded-xl shadow-lg">
        <div className="flex items-center">
          <div className="w-9 h-9 rounded-full bg-slate-800" />
          <div className="flex flex-col ml-3">
            <p className="font-bold">Test</p>
          </div>
        </div>
        <div className="text-sm ml-12 mb-3 font-medium">Thank</div>
        <div className="flex ml-12 text-xs">
          <p className="">3 Days</p>
          <p className="mx-2">Like</p>
          <p className="">Reply</p>
        </div>
      </div>
    </>
  );
};

export default ReplyBox;
