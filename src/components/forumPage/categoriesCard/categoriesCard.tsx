import React, { useState } from "react";
import "./categoriesCard.css";

import {
  fetchLastestTopics,
  fetchTopics,
  getProfileImageURL,
} from "../../../api";

import Skeleton from "@mui/material/Skeleton";

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
  const [topics, setTopics] = useState<any[]>([]);
  const [lastestTopic, setLastestTopic] = useState<any[]>([]);
  const [profileImages, setProfileImages] = useState<{ [key: string]: string }>(
    {}
  );

  const filteredTopics = topics.filter((topic) => topic.categoryName === name);
  const filteredLastestTopics = lastestTopic.filter(
    (lastest) => lastest.categoryName === name
  );

  React.useEffect(() => {
    const fetchAllLengthTopics = async () => {
      try {
        const topicsData = await fetchTopics();
        if (Array.isArray(topicsData.topics)) {
          const topicsArray = topicsData.topics;
          setTopics(topicsArray);
        } else {
          console.error("Invalid topics data");
        }
      } catch (error) {
        console.error("Error in fetchAllTopics:", error);
      }
    };

    const lastestTopic = async () => {
      try {
        const lastest = await fetchLastestTopics();

        // Fetch profile images for all latest topics
        const imagePromises = lastest.map((topic: any) =>
          getProfileImageURL(topic.uid)
        );
        const imageUrls = await Promise.all(imagePromises);

        const newProfileImages = lastest.reduce(
          (acc: any, topic: any, index: any) => {
            acc[topic.uid] = imageUrls[index];
            return acc;
          },
          {} as { [key: string]: string }
        );

        setLastestTopic(lastest);
        setProfileImages(newProfileImages); // Save the profile images in state
      } catch (error) {
        console.error("Error in lastestTopic:", error);
      }
    };

    lastestTopic();
    fetchAllLengthTopics();
  }, []);

  return (
    <div
      id="category-card"
      className="rounded-3xl h-82 p-10 font-bold shadow-md hover:shadow-2xl cursor-pointer duration-75"
      onClick={onClick}
    >
      <div
        id="category-banner"
        className="h-20 px-8 mb-8 text-white rounded-2xl flex items-center shadow-md"
        style={{ backgroundColor: bannerColor }}
      >
        <p id="category-name">{name}</p>
      </div>
      <div id="information-category-1" className="flex">
        <div id="count-categories" className="w-1/3 ">
          <p className="text-xs">TOPICS</p>
          <div id="count-categories-value">
            <span>{filteredTopics.length}</span>
          </div>
        </div>
        <div id="last-activity-categories">
          <p className="text-xs">LAST ACTIVITY</p>
          <div id="last-activity-topic-value">
            <span>
              {filteredLastestTopics.length > 0
                ? filteredLastestTopics.map(
                    (item: { datePost: string; timePost: string }) => {
                      const today = new Date();
                      const yyyy = today.getFullYear();
                      let mm = today.getMonth() + 1;
                      let dd = today.getDate();
                      const isToday = dd + "/" + mm + "/" + yyyy;

                      return isToday === item.datePost
                        ? `Today, ${item.timePost}`
                        : `${item.datePost}, ${item.timePost}`;
                    }
                  )[0]
                : <Skeleton variant="rounded" width={200} height={20} className="mt-1" />}
            </span>
          </div>
        </div>
      </div>
      <div id="information-category-2" className="mt-4">
        <p className="text-xs">LAST TOPIC</p>
        <div id="count-categories-value" className="h-full flex mt-2">
          {filteredLastestTopics.length > 0 ? (
            filteredLastestTopics.map((item) => {
              return (
                <div key={item.uid}>
                  <div className="flex items-center">
                    <div
                      id="author-image-profile"
                      className="h-9 w-9 rounded-full"
                      style={{
                        backgroundImage: `url(${
                          profileImages[item.uid] || ""
                        })`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                    <div className="w-72 mx-2 text-xs">{item.topicTitle}</div>
                  </div>
                </div>
              );
            })[0]
          ) : (
            <div className="flex items-center">
              <Skeleton variant="circular" width={36} height={36} />
              <Skeleton variant="rounded" width={288} height={36} className="mx-1" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoriesCard;
