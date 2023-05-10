import React, { useEffect, useState } from "react";
import { Category } from "../forumPage";
import { Link } from "react-router-dom";
import CategoriesCard from "../categoriesCard/categoriesCard";
import { getCategories } from "../../../api";

interface Props {
  categories: Category[];
  handleCategoryClick: (topicName: string) => void;
}

const ForumListCategories: React.FC<Props> = ({ categories, handleCategoryClick }) => {
  return (
    <div className="h-full w-full">
      <div id="forum-list" className="grid gap-8 grid-cols-3">
        {categories &&
          categories.map((category) => (
            <CategoriesCard
              key={category._id}
              name={category.name}
              bannerColor={category.bannerColor}
              onClick={() => handleCategoryClick(category.name)}
            />
          ))}
      </div>
    </div>
  );
};

export default ForumListCategories;
