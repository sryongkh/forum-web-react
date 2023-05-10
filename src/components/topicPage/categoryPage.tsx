import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import NewTopicForm from "./newTopicForm/newTopicForm";

import { getCategoryName, getTags } from "../../api";

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

const CategoryPage: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [tags, setTags] = useState<Tag[]>([]);
  const [bannerColor, setBannerColor] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleNewCategoryClick = () => {
    // if (!user) {
    //   setIsModalLoginOpen(true);
    // } else {
    setIsModalOpen(true);
    // }
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

  const tagCategory = tags.find((tags) => tags.category === category?.name);

  useEffect(() => {
    getCategory();
    getTagsName();
  }, [name]);

  return (
    <>
      <NewTopicForm
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
      />
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
          <tr className="border-b text-xs font-bold">
            <td className="w-6/12">TOPIC</td>
            <td className="w-3/12">USERS</td>
            <td className="w-2/12">REPLIES</td>
            <td className="w-1/12">VIEWS</td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default CategoryPage;
