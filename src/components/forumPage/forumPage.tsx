import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createCategories, createTags, fetchCategories } from "../../api";
import { initializeApp } from "firebase/app";
import firebaseConfig from "../../firebase";
import { getAuth, User } from "firebase/auth";

import "./forumPage.css";

import CategoriesCard from "./categoriesCard/categoriesCard";
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
}

const app = initializeApp(firebaseConfig);
const auth = getAuth();

const ForumPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState<JSX.Element[]>([]);
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

  const handleSubmit = async (name: string, bannerColor: string) => {
    const categoriesCardData = await createCategories(name, bannerColor);
    await createTags(name, []);
    setNewCategory([
      ...newCategory,
      <CategoriesCard
        key={categoriesCardData._id}
        name={name}
        bannerColor={bannerColor}
        onClick={() => handleCategoryClick(categoriesCardData._id)}
      />,
    ]);
    setIsModalOpen(false);
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
      <div id="header" className="grid grid-cols-2 my-10">
        <div id="filter" className="flex items-center font-bold">
          <a
            className="cursor-pointer"
            onClick={() => {
              setIsPopularSelected(true);
              setIsCategoriesSelected(false);
            }}
          >
            POPULAR
          </a>
          <a
            className="ml-16 cursor-pointer"
            onClick={() => {
              setIsPopularSelected(false);
              setIsCategoriesSelected(true);
            }}
          >
            CATEGORIES
          </a>
        </div>
        <div id="button" className="flex justify-end items-center text-white">
          <button
            id="btn-new-category"
            className="h-14 px-5 rounded-md font-bold"
            style={{ backgroundColor: "var(--spaceCadet)" }}
            onClick={handleNewCategoryClick}
          >
            <FontAwesomeIcon
              icon={faPlus}
              style={{ color: "var(--white)" }}
              className="mr-2"
            />
            New Categories
          </button>
          <NewCategoryModal
            isOpen={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            onSubmit={handleSubmit}
          />
          <LoginAlertModal isAlertOpen={isModalLoginOpen} />
        </div>
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          {isPopularSelected && <ForumListPopular />}
          {isCategoriesSelected && (
            <ForumListCategories
              categories={categories}
              handleCategoryClick={handleCategoryClick}
            />
          )}
        </>
      )}
    </>
  );
};

export default ForumPage;
