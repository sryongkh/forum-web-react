import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createCategories, createTags, fetchCategories } from "../../api";
import { initializeApp } from "firebase/app";
import firebaseConfig from "../../firebase";
import { getAuth, User } from "firebase/auth";

import "./forumPage.css";

import SelectTopicTab from "./selectTopicTab/selectTopic";
import NewCategoryModal from "./newCategoryModal/newCategoryModal";
import LoginAlertModal from "../loginPage/loginAlertModal/loginAlertModal";
import ForumListCategories from "./forumListCategories/forumListCategories";
import ForumListPopular from "./forumListPopular/forumListPopular";

// import axios from "axios";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

export interface Category {
  _id: string;
  name: string;
  bannerColor: string;
  // description: string;
  // createdAt: Date;
  // updatedAt: Date;
  id: string;
}

const app = initializeApp(firebaseConfig);
const auth = getAuth();

const ForumPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalLoginOpen, setIsModalLoginOpen] = useState(false);
  const [isPopularSelected, setIsPopularSelected] = useState(false);
  const [isCategoriesSelected, setIsCategoriesSelected] = useState(true);

  const navigate = useNavigate();

  const handleNewCategoryClick = () => {
    if (!user) {
      setIsModalLoginOpen(true);
    } else {
      setIsModalOpen(true);
    }
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      }
    });

    setIsLoading(true);
    fetchCategories(setCategories)
      .then(() => setIsLoading(false))
      .catch(() => setIsLoading(false));

    const interval = setInterval(() => {
      fetchCategories(setCategories);
    }, 5000);

    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, []);

  const handleCategoryClick = (categoryName: string) => {
    navigate(`/category/${categoryName}`);
  };

  return (
    <>
      <SelectTopicTab />
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <ForumListCategories
            categories={categories}
            handleCategoryClick={handleCategoryClick}
          />
        </>
      )}
    </>
  );
};

export default ForumPage;
