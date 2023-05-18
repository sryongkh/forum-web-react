import React from "react";
import { fetchTopics, getProfileImageURL, incrementViews } from "../../../api";

import SelectTopicTab from "../selectTopicTab/selectTopic";
import TopicContentDialog from "../../topicPage/topicContentDialog/topicContentDialog";

import Skeleton from "@mui/material/Skeleton";

type Topic = {
  _id: string;
  uid: string;
  topicTitle: string;
  categoryName: string;
  displayName: string;
  replyList: any[];
  views: number;
};

const ForumListPopular = () => {
  const [topics, setTopics] = React.useState<Topic[]>([]);
  const [sortBy, setSortBy] = React.useState("views");
  const [topicContentOpen, setTopicContentOpen] = React.useState(false);
  const [selectedTopicId, setSelectedTopicId] = React.useState("");
  const [views, setViews] = React.useState(0);
  const [profileImages, setProfileImages] = React.useState<{
    [key: string]: string;
  }>({});

  const handleTopicClick = async (topicId: string) => {
    setTopicContentOpen(true);
    setSelectedTopicId(topicId);
    const updatedViews = await incrementViews(topicId);
    setViews(updatedViews);
  };

  React.useEffect(() => {
    const getTopics = async () => {
      const data = await fetchTopics();
      const sortedTopics = data.topics.sort(
        (a: any, b: any) => b.views - a.views
      );

      if (Array.isArray(sortedTopics)) {
        let newProfileImages: { [key: string]: string } = {};
        for (let topic of sortedTopics) {
          const imageURL = await getProfileImageURL(topic.uid);
          newProfileImages[topic.uid] = imageURL;
        }
        setProfileImages(newProfileImages);
        setTopics(sortedTopics);
      } else {
        console.error("Invalid topics data");
      }
    };
    getTopics();
  }, []);

  return (
    <>
      <TopicContentDialog
        isOpen={topicContentOpen}
        onRequestClose={() => {
          setTopicContentOpen(false);
          setSelectedTopicId("");
        }}
        topicId={selectedTopicId}
        handleThreadReplyClick={(displayName, threadId) => {
          // your logic here
        }}
      />
      <SelectTopicTab />
      <div className="h-full w-full">
        <table className="w-full">
          <tbody>
            <tr className="border-b text-xs font-bold">
              <td className="w-6/12">TOPIC</td>
              <td className="w-2/12">CATEGORY</td>
              <td className="w-3/12">USERS</td>
              <td className="w-2/12">REPLIES</td>
              <td className="w-2/12">VIEWS</td>
            </tr>

            {topics.length > 0 ? (
              topics.map((topic) => (
                <tr
                  key={topic._id}
                  id="topic-row"
                  className="h-16 text-sm font-bold cursor-pointer"
                  onClick={() => handleTopicClick(topic._id)}
                >
                  <td className="w-6/12">{topic.topicTitle}</td>
                  <td className="w-2/12">{topic.categoryName}</td>
                  <td className="w-3/12">
                    <div
                      className="w-10 h-10 mr-2 bg-slate-600 rounded-full"
                      style={{
                        backgroundImage: `url(${profileImages[topic.uid]})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                  </td>
                  <td className="w-2/12">
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{topic.replyList.length}
                  </td>
                  <td className="w-2/12">
                    &nbsp;&nbsp;&nbsp;&nbsp;{topic.views}
                  </td>
                </tr>
              ))
            ) : (
              <tr
                id="topic-row"
                className="h-16 text-sm font-bold cursor-pointer"
              >
                <td className="w-6/12">
                  <Skeleton variant="rounded" width={550} className="mx-1" />
                </td>
                <td className="w-3/12">
                  <Skeleton variant="circular" width={36} height={36} />
                </td>
                <td className="w-2/12">
                  <Skeleton variant="rounded" width={100} className="mx-1" />
                </td>
                <td className="w-1/12">
                  <Skeleton variant="rounded" width={50} className="mx-1" />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ForumListPopular;
