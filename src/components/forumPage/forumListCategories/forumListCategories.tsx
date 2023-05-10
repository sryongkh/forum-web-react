import React, { useEffect, useState } from "react";
import { Topic } from "../forumPage";
import { Link } from "react-router-dom";
import CategoriesCard from "../categoriesCard/categoriesCard";
import { getTopics } from "../../../api";

interface Props {
  topics: Topic[];
  handleTopicClick: (topicName: string) => void;
}

const ForumListCategories: React.FC<Props> = ({ topics, handleTopicClick }) => {
  return (
    <div className="h-full w-full">
      <div id="forum-list" className="grid gap-8 grid-cols-3">
        {topics &&
          topics.map((topic) => (
            <CategoriesCard
              key={topic._id}
              name={topic.name}
              bannerColor={topic.bannerColor}
              onClick={() => handleTopicClick(topic.name)}
            />
          ))}
      </div>
    </div>
  );
};

export default ForumListCategories;
