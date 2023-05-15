import React from "react";
import { fetchTopics } from "../../../api";

import SelectTopicTab from "../selectTopicTab/selectTopic";

import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

type Topic = {
  _id: string;
  topicTitle: string;
  categoryName: string;
  displayName: string;
  replyList: any[];
  views: number;
};

const ForumListPopular = () => {
  const [topics, setTopics] = React.useState<Topic[]>([]);
  const [sortBy, setSortBy] = React.useState("views");

  React.useEffect(() => {
    const getTopics = async () => {
      const data = await fetchTopics();
      const sortedTopics = data.topics.sort(
        (a: any, b: any) => b.views - a.views
      );
      setTopics(sortedTopics);
    };
    getTopics();
  }, []);

  return (
    <>
      <SelectTopicTab />
      <div className="h-full w-full">
        <table className="w-full">
          <thead>
            <tr className="border-b text-xs font-bold">
              <td className="w-6/12">TOPIC</td>
              <td className="w-2/12">CATEGORY</td>
              <td className="w-3/12">USERS</td>
              <td className="w-2/12">REPLIES</td>
              <td className="w-2/12">VIEWS</td>
            </tr>
          </thead>
          <tbody>
            {topics.map((topic) => (
              <tr
                key={topic._id}
                id="topic-row"
                className="h-16 text-sm font-bold cursor-pointer"
                // onClick={() => handleTopicClick(topic._id)}
              >
                <td className="w-6/12">{topic.topicTitle}</td>
                <td className="w-2/12">{topic.categoryName}</td>
                <td className="w-3/12">
                  <div
                    className="w-10 h-10 mr-2 bg-slate-600 rounded-full"
                    style={{
                      // backgroundImage: `url(${profileImages[topic.uid]})`,
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
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ForumListPopular;
