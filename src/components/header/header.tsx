import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./header.css";
import UserDropdown from "../loginPage/userDropdown/userDropdown";

import axios from "axios";

import { getAuth, User } from "firebase/auth";

import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faBars } from "@fortawesome/free-solid-svg-icons";

// interface Topic {
//   name: string;
// }

const Header: React.FC = () => {
  const location = useLocation();

  if (
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname === "/forgotpassword"
  ) {
    return null;
  }
  // const [topics, setTopics] = useState<Topic[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  // const fetchCategories = async () => {
  //   try {
  //     const response = await axios.get("http://localhost:5000/categories");
  //     setCategories(response.data.topics);
  //   } catch (err) {
  //     if (err instanceof Error) {
  //       console.error("Error fetching topics:", err.message);
  //     } else {
  //       console.error("Unknown error occurred:", err);
  //     }
  //   }
  // };

  const navigate = useNavigate();

  const handleIndexPage = () => {
    navigate(`/`);
  };

  useEffect(() => {
    // fetchCategories();
    // const interval = setInterval(() => {
    //   fetchCategories();
    // }, 3000);

    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        setShowLoginPopup(false);
      } else {
        setShowLoginPopup(true);
      }
    });

    return () => {
      // clearInterval(interval);
      unsubscribe();
    };
  }, undefined);

  return (
    <header
      id="navbar"
      className="rounded-t-3xl p-5 items-center h-full w-full shadow-md"
    >
      <div id="contents" className="grid items-center">
        <div
          id="logo"
          className="h-11 w-11 cursor-pointer"
          onClick={handleIndexPage}
        ></div>
        <div
          id="search"
          className="grid items-center h-full w-full rounded-full shadow-md"
        >
          <input
            id="search-box"
            className="ml-8 mr-2 bg-transparent"
            placeholder="Search"
          />
          <div id="vertical-hr"></div>
          <select id="search-selected" className="h-11 bg-transparent">
            <option value="all-topic-name">All</option>
            {/* {topics.map((topic) => (
              <option value={topic.name} key={topic.name}>
                {topic.name}
              </option>
            ))} */}
          </select>
          <button
            id="btn-search"
            className="flex justify-center items-center h-11 m-1 rounded-3xl"
          >
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              style={{ color: "var(--white)" }}
            />
          </button>
        </div>
        <div id="profile-menu" className="flex justify-end items-center">
          {user ? (
            <div>
              <span id="username" className="font-bold">
                <UserDropdown user={user} />
              </span>
              {/* <button className="ml-4 font-bold" onClick={logout}>
                Logout
              </button> */}
            </div>
          ) : (
            <Link to="/login" className="font-bold">
              Login
            </Link>
          )}
          <FontAwesomeIcon className="mx-5" icon={faBars} />
        </div>
      </div>
    </header>
  );
};

export default Header;
