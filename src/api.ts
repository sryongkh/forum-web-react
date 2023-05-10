import axios from "axios";
import firebaseConfig from "./firebase";
import { updateProfile } from "firebase/auth";
import { initializeApp } from "firebase/app";

import { Topic } from "./components/forumPage/forumPage";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import userProfilePic from "../src/assets/user.png";

const app = initializeApp(firebaseConfig);
const storage = getStorage();
const API_URL = "http://localhost:5000";

// User's Profile
export const saveUsername = async (user: any, username: string) => {
  try {
    if (user && user.email) {
      await updateProfile(user, {
        displayName: username,
      });
    } else {
      throw new Error("User not logged in");
    }
  } catch (error) {
    console.error("Error saving username:", error);
    throw error;
  }
};

export const updateUserProfile = async (
  uid: string,
  displayName: string,
  address: string,
  phoneNumber: string
) => {
  const response = await axios.post("${API_URL}/profile/update-profile", {
    uid,
    displayName,
    address,
    phoneNumber,
  });
  return response.data;
};

export const fetchUserProfile = async (displayName: string) => {
  try {
    const response = await axios.get(`${API_URL}/profile/${displayName}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

export const getProfileImageURL = async (uid: string): Promise<string> => {
  try {
    const storageRef = ref(storage, `profile_images/${uid}`);
    const imageURL = await getDownloadURL(storageRef);
    return imageURL;
  } catch (error) {
    console.log("Error fetching profile image URL:", error);
    return userProfilePic; // ใช้รูปภาพเริ่มต้นเมื่อไม่พบไฟล์ใน Storage
  }
};

// Topics
export const getTopics = async () => {
  try {
    const response = await axios.get(`${API_URL}/topics`);
    return response.data.topics;
  } catch (err) {
    if (err instanceof Error) {
      console.error("Error fetching topics:", err.message);
    } else {
      console.error("Unknown error occurred:", err);
    }
  }
};

export const fetchTopics = async (
  setTopics: React.Dispatch<React.SetStateAction<Topic[]>>
) => {
  try {
    const response = await axios.get("http://localhost:5000/topics");
    setTopics(response.data.topics);
  } catch (err) {
    if (err instanceof Error) {
      console.error("Error fetching topics:", err.message);
    } else {
      console.error("Unknown error occurred:", err);
    }
  }
};

export const createCategories = async (name: string, bannerColor: string) => {
  try {
    const response = await axios.post(`${API_URL}/categories`, {
      name,
      bannerColor,
    });
    return response.data;
  } catch (err) {
    if (err instanceof Error) {
      console.error("Error creating category:", err.message);
    } else {
      console.error("Unknown error occurred:", err);
    }
  }
};
