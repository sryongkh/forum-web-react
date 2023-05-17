import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAuth, User } from "firebase/auth";
import { initializeApp } from "firebase/app";
import firebaseConfig from "../../../firebase";

import { createCategories, createTags, fetchCategories } from "../../../api";
import "./selectTopic.css";
import NewCategoryModal from "../newCategoryModal/newCategoryModal";
import LoginAlertModal from "../../loginPage/loginAlertModal/loginAlertModal";
import CategoriesCard from "../categoriesCard/categoriesCard";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const app = initializeApp(firebaseConfig);
const auth = getAuth();

const SelectTopicTab = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = React.useState<User | null>(null);
  const [newCategory, setNewCategory] = React.useState<JSX.Element[]>([]);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isModalLoginOpen, setIsModalLoginOpen] = React.useState(false);
  const [selected, setSelected] = React.useState("CATEGORIES");

  const handleNewCategoryClick = () => {
    if (!user) {
      setIsModalLoginOpen(true);
    } else {
      setIsModalOpen(true);
    }
  };

  const handlePopularClick = () => {
    navigate(`/category/popular`);
  };

  const handleCategoriesClick = () => {
    navigate(`/`);
  };

  const handleCategoryClick = (categoryName: string) => {
    navigate(`/category/${categoryName}`);
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

  React.useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  React.useEffect(() => {
    if (location.pathname === "/") {
      setSelected("CATEGORIES");
    } else if (location.pathname === "/category/popular") {
      setSelected("POPULAR");
    }
  }, [location]);

  return (
    <>
      <div id="header" className="grid grid-cols-2 my-10">
        <div id="filter" className="flex items-center font-bold">
          <a
            id="filter-menu"
            className={`cursor-pointer ${
              selected === "POPULAR" ? "text-red-500" : "text-gray-400"
            }`}
            onClick={() => {
              handlePopularClick();
            }}
          >
            POPULAR
          </a>
          <a
            id="filter-menu"
            className={`ml-16 cursor-pointer ${
              selected === "CATEGORIES" ? "text-red-500" : "text-gray-400"
            }`}
            onClick={() => {
              handleCategoriesClick();
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
    </>
  );
};

export default SelectTopicTab;
