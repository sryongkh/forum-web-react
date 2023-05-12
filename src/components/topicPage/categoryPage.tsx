import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

import { User, getAuth } from "firebase/auth";
// import { initializeApp } from "firebase/app";
// import firebaseConfig from "../../firebase";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import NewTopicForm from "./newTopicForm/newTopicForm";
import LoginAlertModal from "../loginPage/loginAlertModal/loginAlertModal";
import TopicContentDialog from "./topicContentDialog/topicContentDialog";

import { getCategoryName, getTags, fetchTopics } from "../../api";

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

  const [topicContentOpen, setTopicContentOpen] = useState(false);
  const [selectedTopicId, setSelectedTopicId] = useState("");

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

  const handleTopicClick = (topicId: string) => {
    setSelectedTopicId(topicId);
    setTopicContentOpen(true);
  };

  const handleDialogConfirm = () => {
    // navigate(`/topic/${selectedTopicId}`);
    setTopicContentOpen(false);
  };

  useEffect(() => {
    getCategory();
    getTagsName();
  }, [name]);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log(user);
      if (user) {
        setCurrentUser(user);
      }
    });
    const fetchAllTopics = async () => {
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
    fetchAllTopics();

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <>
      <TopicContentDialog
        isOpen={topicContentOpen}
        onRequestClose={() => setTopicContentOpen(false)}
        topicId={selectedTopicId}
      />
      <NewTopicForm
        isOpen={isModalOpen}
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
          {filteredTopics.map((topic) => (
            <tr
              key={topic._id}
              id="topic-row"
              className="h-16 text-sm font-bold cursor-pointer"
              onClick={() => handleTopicClick(topic._id)}
            >
              <td className="w-6/12">{topic.topicTitle}</td>
              <td className="w-3/12">{topic.displayName}</td>
              <td className="w-2/12">{topic.replyList.length}</td>
              <td className="w-1/12">{topic.views}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default CategoryPage;
