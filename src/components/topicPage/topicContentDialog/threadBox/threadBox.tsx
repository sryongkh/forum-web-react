import React from "react";
import { getThreads, getReplies } from "../../../../api";
import ThreadItem from "./threadItem";
import ReplyThread from "./replyThreadItem";
// import Reply from "./replyThreadItem";

type Thread = {
  _id: string;
  topicId: string;
  displayName: string;
  datePost: string;
  timePost: string;
  content: string;
};

interface Reply {
  _id: string;
  threadId: string;
  displayName: string;
  datePost: string;
  timePost: string;
  content: string;
}

interface ThreadBoxProps {
  topicId: string | undefined;
  handleReplyClick: (displayName: string, threadId: string) => void;
}

const ThreadBox: React.FC<ThreadBoxProps> = ({ topicId, handleReplyClick }) => {
  const [threadsData, setThreadsData] = React.useState<Thread[]>([]);
  const [repliesData, setRepliesData] = React.useState<Reply[]>([]);

  React.useEffect(() => {
    const fetchThreads = async () => {
      const data = await getThreads();
      if (Array.isArray(data.threads)) {
        setThreadsData(data.threads);
      }
    };

    const fetchReplies = async () => {
      const replies = await getReplies();
      setRepliesData(replies);
    };

    fetchThreads();
    fetchReplies();
    console.log(repliesData);
  }, []);

  // React.useEffect(() => {
  //   const fetchReplies = async () => {
  //     const replies = await getReplies();
  //     setRepliesData(replies);
  //   };
  //   fetchReplies();
  //   console.log(repliesData);
  // }, []);

  return (
    <>
      {threadsData.length > 0 ? (
        threadsData
          .filter((thread) => thread?.topicId === topicId)
          .map((thread) => {
            const relevantReplies = repliesData.filter(
              (reply) => reply.threadId === thread._id
            );

            return (
              <React.Fragment key={thread._id}>
                <ThreadItem
                  thread={thread}
                  handleReplyClick={handleReplyClick}
                />
                {relevantReplies.length > 0 && (
                  <ReplyThread replies={relevantReplies} />
                )}
              </React.Fragment>
            );
          })
      ) : (
        <div>No replies</div>
      )}

      {/* Display replies */}
      {/* {repliesData.length > 0 && <ReplyThread replies={repliesData} />} */}
    </>
  );
};

export default ThreadBox;
