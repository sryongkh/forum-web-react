import React, { useState, useEffect } from "react";
import { createCategories } from "../../api";
import "./forumTab.css";
import NewCategory from "../newTopic/newTopic";
import NewCategoryModal from "../newCategoryModal/newCategoryModal";
import axios from "axios";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

interface Category {
  _id: string;
  name: string;
  bannerColor: string;
}

const ForumTab: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategories, setNewCategories] = useState<JSX.Element[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const handleNewTopicClick = () => {
    setIsModalOpen(true);
  };

  const handleSubmit = async (name: string, bannerColor: string) => {
    const newCategoryData = await createCategories(name, bannerColor);
    setNewCategories([
      ...newCategories,
      <NewCategory
        key={newCategoryData._id}
        name={name}
        bannerColor={bannerColor}
      />,
    ]);
    setIsModalOpen(false);
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:5000/categories/");
      const categories = response.data.categories;
      setCategories(categories);
    } catch (err) {
      if (err instanceof Error) {
        console.error("Error fetching topics:", err.message);
      } else {
        console.error("Unknown error occurred:", err);
      }
    }
  };

  useEffect(() => {
    fetchCategories();
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
          <NewCategoryModal
            isOpen={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
      <div className="h-full w-full">
        <div id="forum-list" className="grid gap-8 grid-cols-3">
          {categories.map((categories) => (
            <NewCategory
              key={categories._id}
              name={categories.name}
              bannerColor={categories.bannerColor}
            />
          ))}
          {newCategories}
        </div>
      </div>
    </div>
  );
};

export default ForumTab;
