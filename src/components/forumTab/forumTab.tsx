import React, { useState, useEffect } from "react";
import { createTopic } from "../../api";
import "./forumTab.css";
import NewTopic from "../newTopic/newTopic";
import NewTopicModal from "../newTopicModal/newTopicModal";
import axios from "axios";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

interface Topic {
  _id: string;
  name: string;
  bannerColor: string;
}

const ForumTab: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTopics, setNewTopics] = useState<JSX.Element[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);

  const handleNewTopicClick = () => {
    setIsModalOpen(true);
  };

  const handleSubmit = async (name: string, bannerColor: string) => {
    const newTopicData = await createTopic(name, bannerColor);
    setNewTopics([
      ...newTopics,
      <NewTopic key={newTopicData._id} name={name} bannerColor={bannerColor} />,
    ]);
    setIsModalOpen(false);
  };

  const fetchTopics = async () => {
    try {
      const response = await axios.get("http://localhost:5000/topics/");
      const topics = response.data.topics;
      setTopics(topics);
    } catch (err) {
      if (err instanceof Error) {
        console.error("Error fetching topics:", err.message);
      } else {
        console.error("Unknown error occurred:", err);
      }
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  return (
    <div>
      <div id="header" className="grid grid-cols-2 my-10">
        <div id="filter" className="flex items-center font-bold">
          <a href="#">POPULAR</a>
          <a href="#" className="ml-16">
            CATEGORIES
          </a>
        </div>
        <div id="button" className="flex justify-end items-center text-white">
          <button
            id="btn-new-topic"
            className="h-14 px-5 rounded-md font-bold"
            style={{ backgroundColor: "var(--spaceCadet)" }}
            onClick={handleNewTopicClick}
          >
            <FontAwesomeIcon
              icon={faPlus}
              style={{ color: "var(--white)" }}
              className="mr-2"
            />
            New Topic
          </button>
          <NewTopicModal
            isOpen={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
      <div className="h-full w-full">
        <div id="forum-list" className="grid gap-8 grid-cols-3">
          {topics.map((topic) => (
            <NewTopic
              key={topic._id}
              name={topic.name}
              bannerColor={topic.bannerColor}
            />
          ))}
          {newTopics}
        </div>
      </div>
    </div>
  );
};

export default ForumTab;
