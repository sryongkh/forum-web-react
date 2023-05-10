import React, { useState } from "react";
import "./categoriesCard.css";

interface categoriesCardProps {
  name: string;
  bannerColor: string;
  onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const CategoriesCard: React.FC<categoriesCardProps> = ({
  name,
  bannerColor,
  onClick,
}) => {
  return (
    <div
      id="category-card"
      className="rounded-3xl h-80 p-10 font-bold shadow-md hover:shadow-2xl cursor-pointer"
      onClick={onClick}
    >
      <div
        id="category-banner"
        className="h-20 px-8 mb-8 text-white rounded-2xl flex items-center"
        style={{ backgroundColor: bannerColor }}
      >
        <p id="category-name">{name}</p>
      </div>
      <div id="information-category-1" className="grid grid-cols-2">
        <div id="count-categories">
          <p className="text-xs">TOPICS</p>
          <div id="count-categories-value">
            <span>0</span>
          </div>
        </div>
        <div id="last-activity-categories">
          <p className="text-xs">LAST ACTIVITY</p>
          <div id="last-activity-topic-value">
            <span></span>
          </div>
        </div>
      </div>
      <div id="information-category-2" className="mt-4">
        <p className="text-xs">LAST TOPIC</p>
        <div id="count-categories-value" className="flex mt-2">
          <div className="h-9 w-9 rounded-full bg-gray-800"></div>
          <div className="h-9 mx-4 text-xs">
            <span>Test</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriesCard;
