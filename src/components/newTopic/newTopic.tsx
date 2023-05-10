import React, { useState } from "react";
import "./newCategory.css";

interface NewCategoryProps {
  name: string;
  bannerColor: string;
}

const NewCategory: React.FC<NewCategoryProps> = ({ name, bannerColor }) => {
  return (
    <div className="rounded-3xl h-80 p-10 font-bold shadow-md">
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
          <div id="count-topics-value">185</div>
        </div>
        <div id="last-activity-topics">
          <p className="text-xs">LAST ACTIVITY</p>
          <div id="last-activity-topics-value">Today, 23:57</div>
        </div>
      </div>
      <div id="information-topic-2" className="mt-4">
        <p className="text-xs">LAST TOPIC</p>
        <div id="count-topics-value" className="flex mt-2">
          <div className="h-9 w-9 rounded-full bg-gray-800"></div>
          <div className="h-9 mx-4 text-xs">Pass NCLEX</div>
        </div>
      </div>
    </div>
  );
};

export default NewCategory;
