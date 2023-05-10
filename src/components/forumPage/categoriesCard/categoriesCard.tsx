import React, { useState } from "react";
import "./categoriesCard.css";

interface categoriesCardProps {
  name: string;
  bannerColor: string;
  onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const CategoriesCard: React.FC<categoriesCardProps> = ({ name, bannerColor, onClick }) => {
  return (
    <div id="topic-card" className="rounded-3xl h-80 p-10 font-bold shadow-md hover:shadow-2xl cursor-pointer" onClick={onClick}>
      <div
        id="topic-banner"
        className="h-20 px-8 mb-8 text-white rounded-2xl flex items-center"
        style={{ backgroundColor: bannerColor }}
      >
        <p id="topic-name">{name}</p>
      </div>
      <div id="information-topic-1" className="grid grid-cols-2">
        <div id="count-topics">
          <p className="text-xs">TOPICS</p>
          <div id="count-topics-value"><span>0</span></div>
        </div>
        <div id="last-activity-topics">
          <p className="text-xs">LAST ACTIVITY</p>
          <div id="last-activity-topics-value"><span></span></div>
        </div>
      </div>
      <div id="information-topic-2" className="mt-4">
        <p className="text-xs">LAST TOPIC</p>
        <div id="count-topics-value" className="flex mt-2">
          <div className="h-9 w-9 rounded-full bg-gray-800"></div>
          <div className="h-9 mx-4 text-xs"><span></span></div>
        </div>
      </div>
    </div>
  );
};

export default CategoriesCard;
