import { useRef, useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

import { User, getAuth } from "firebase/auth";
// import { initializeApp } from "firebase/app";
// import firebaseConfig from "../../firebase";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import Skeleton from "@mui/material/Skeleton";

import NewTopicForm from "./newTopicForm/newTopicForm";
import LoginAlertModal from "../loginPage/loginAlertModal/loginAlertModal";
import TopicContentDialog from "./topicContentDialog/topicContentDialog";

import {
  getCategoryName,
  getTags,
  fetchTopics,
  getProfileImageURL,
  getViews,
  incrementViews
} from "../../api";

import "./categoryPage.css";

interface Category {
  name: string;
  tagName: string[];
}

interface Tag {
  _id: string;
  category: string;
  tagName: string[];
  __v: number;
}

const auth = getAuth();
const user = auth.currentUser;

const CategoryPage: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [topics, setTopics] = useState<any[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [bannerColor, setBannerColor] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalLoginOpen, setIsModalLoginOpen] = useState(false);
  const [views, setViews] = useState(0);

  const [topicContentOpen, setTopicContentOpen] = useState(false);
  const [selectedTopicId, setSelectedTopicId] = useState("");
  const [profileImages, setProfileImages] = useState<{ [key: string]: string }>(
    {}
  );

  const tagCategory = tags.find((tags) => tags.category === category?.name);
  const filteredTopics = topics.filter(
    (topic) => topic.categoryName === category?.name
  );

  const handleNewCategoryClick = () => {
    if (!currentUser) {
      setIsModalLoginOpen(true);
    } else {
      setIsModalOpen(true);
    }
  };

  const handleSubmitNewTopic = () => {
    setIsModalOpen(false);
  };

  const getCategory = async () => {
    if (!name) {
      return;
    } else {
      const categoryData = await getCategoryName(name);
      setCategory(categoryData);
      setBannerColor(categoryData.bannerColor);
    }
  };

  const getTagsName = async () => {
    const tagsData = await getTags();
    setTags(tagsData);
  };

  const handleTopicClick = async (topicId: string) => {
    setTopicContentOpen(true);
    setSelectedTopicId(topicId);
    const updatedViews = await incrementViews(topicId);
    setViews(updatedViews);
  };

  useEffect(() => {
    getCategory();
    getTagsName();
  }, [name]);

  useEffect(() => {
    getViews(selectedTopicId).then((response) => {
      setViews(response ? response.views : 0);
    });
  }, [selectedTopicId]);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
      }
    });

    const fetchAllTopics = async () => {
      try {
        const topicsData = await fetchTopics();
        if (Array.isArray(topicsData.topics)) {
          const topicsArray = topicsData.topics;
          let newProfileImages: { [key: string]: string } = {};
          for (let topic of topicsArray) {
            const imageURL = await getProfileImageURL(topic.uid);
            newProfileImages[topic.uid] = imageURL;
          }
          setProfileImages(newProfileImages);
          setTopics(topicsArray);
        } else {
          console.error("Invalid topics data");
        }
      } catch (error) {
        console.error("Error in fetchAllTopics:", error);
      }
    };

    fetchAllTopics();

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <>
      <TopicContentDialog
        isOpen={topicContentOpen}
        onRequestClose={() => {
          setTopicContentOpen(false);
          setSelectedTopicId("");
        }}
        topicId={selectedTopicId}
        handleThreadReplyClick={(displayName, threadId) => {
          // your logic here
        }}
      />

      <NewTopicForm
        isOpen={isModalOpen}
        categoryName={category ? category.name : ""}
        onRequestClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitNewTopic}
      />
      <LoginAlertModal isAlertOpen={isModalLoginOpen} />
      <div id="header" className="my-10">
        <div className="text-xs font-bold">
          <Link to="/" className="mt-6 mb-10">
            CATEGORIES
          </Link>
          &nbsp;&nbsp;/&nbsp;&nbsp;{category?.name.toUpperCase()}
        </div>
      </div>
      <div
        id="topic-header-card"
        className="h-40 p-2 mb-12 bg shadow-2xl flex justify-center items-center"
      >
        <div
          className="w-full h-3/5 bg-gray-400 m-8 p-8 rounded-2xl shadow-xl text-white font-bold flex flex-col justify-center"
          style={{ backgroundColor: bannerColor }}
        >
          <div>{category ? <h1>{category.name}</h1> : <p>Loading...</p>}</div>
          <div className="flex flex-wrap text-xs">
            {tagCategory?.tagName
              .slice(0, 5)
              .map((tag: string, index: number) => (
                <p key={index}>#{tag}&nbsp;</p>
              ))}
          </div>
        </div>
      </div>
      <div id="lastest-popular-menu" className="grid grid-cols-2 my-10">
        <div
          id="lastest-popular"
          className="flex items-center text-xs font-bold"
        >
          <a href="#" className="mr-11">
            LASTEST
          </a>
          <a href="#" className="">
            POPULAR
          </a>
        </div>
        <div id="button" className="flex justify-end items-center text-white">
          <button
            id="btn-new-topic"
            className="h-14 px-5 rounded-md font-bold"
            style={{ backgroundColor: "var(--spaceCadet)" }}
            onClick={handleNewCategoryClick}
          >
            <FontAwesomeIcon
              icon={faPlus}
              style={{ color: "var(--white)" }}
              className="mr-2"
            />
            New Topic
          </button>
        </div>
      </div>

      <table className="w-full">
        <tbody>
          <tr className="h-6 border-b text-xs font-medium text-gray-300">
            <td className="w-6/12">TOPIC</td>
            <td className="w-3/12">USERS</td>
            <td className="w-2/12">REPLIES</td>
            <td className="w-1/12">VIEWS</td>
          </tr>
          {filteredTopics.length > 0 ? (
            filteredTopics.map((topic) => (
              <tr
                key={topic._id}
                id="topic-row"
                className="h-16 text-sm font-bold cursor-pointer"
                onClick={() => handleTopicClick(topic._id)}
              >
                <td className="w-6/12">{topic.topicTitle}</td>
                <td className="w-3/12">
                  <div
                    className="w-10 h-10 mr-2 bg-slate-600 rounded-full"
                    style={{
                      backgroundImage: `url(${profileImages[topic.uid]})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                </td>
                <td className="w-2/12">{topic.replyList.length}</td>
                <td className="w-1/12">{topic.views}</td>
              </tr>
            ))
          ) : (
            <tr
              id="topic-row"
              className="h-16 text-sm font-bold cursor-pointer"
            >
              <td className="w-6/12">
                <Skeleton variant="rounded" width={550} className="mx-1" />
              </td>
              <td className="w-3/12">
                <Skeleton variant="circular" width={36} height={36} />
              </td>
              <td className="w-2/12">
                <Skeleton variant="rounded" width={100} className="mx-1" />
              </td>
              <td className="w-1/12">
                <Skeleton variant="rounded" width={50} className="mx-1" />
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
};

export default CategoryPage;
