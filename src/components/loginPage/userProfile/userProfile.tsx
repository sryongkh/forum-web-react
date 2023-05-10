import React, { createRef, useState, useEffect, ChangeEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { User, getAuth } from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "@firebase/storage";
import { initializeApp } from "firebase/app";
// import { useNavigate } from "react-router-dom";
import "./userProfile.css";
import firebaseConfig from "../../firebase";
import {
  updateUserProfile,
  fetchUserProfile,
  saveUsername,
  getProfileImageURL,
} from "../../api";
import userProfilePic from "../../assets/user.png";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);

const UserProfilePage: React.FC = () => {
  const user = auth.currentUser;

  const hiddenFileInput = createRef<HTMLInputElement>();

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [profileImageURL, setProfileImageURL] = useState("");
  const [address, setAddress] = useState("");
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user) {
      const storageRef = ref(storage, `profile_images/${user.uid}`);
      await uploadBytes(storageRef, file);
      const imageURL = await getDownloadURL(storageRef);
      console.log("Image URL:", imageURL);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    if (id === "user-address") {
      setAddress(value);
    } else if (id === "user-username") {
      setUsername(value);
    } else if (id === "user-phone") {
      setPhoneNumber(value);
    }
  };

  const handleSaveProfile = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    try {
      if (user) {
        await updateUserProfile(user.uid, username, address, phoneNumber);
        await saveUsername(user, username);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const fetchProfileImageURL = async () => {
    try {
      if (user) {
        const imageURL = await getProfileImageURL(user.uid);
        console.log("Fetched Image URL:", imageURL);
        if (imageURL !== userProfilePic) {
          setProfileImageURL(imageURL);
        }
      }
    } catch (error) {
      console.log("Error fetching profile image URL:", error);
      setProfileImageURL(userProfilePic); // ใช้รูปภาพเริ่มต้นเมื่อไม่พบไฟล์ใน Storage
    }
  };

  const fetchUserProfileData = async (): Promise<void> => {
    if (user) {
      try {
        const userProfile = await fetchUserProfile(user.displayName ?? "");
        if (userProfile) {
          setAddress(userProfile.address || "");
          setUsername(userProfile.displayName || "");
          setPhoneNumber(userProfile.phoneNumber || "");
        }
      } catch (error) {
        console.log("Error fetching user profile:", error);
      }
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    fetchUserProfileData();
    fetchProfileImageURL();

    fetchUserProfileData();

    const intervalId = setInterval(() => {
      fetchUserProfileData();
      fetchProfileImageURL();
    }, 10000);

    return () => clearInterval(intervalId);
  }, [user]);

  return (
    <div className="h-full w-full bg-slate-white my-12">
      <div className="w-3/4 rounded-xl shadow-lg pb-10">
        <div className="w-full rounded-t-xl bg-slate-500">
          <div
            id="profile-pic"
            className="h-44 w-44 rounded-full bg-slate-300 relative top-28 ml-10 border-4 border-white"
            style={{
              backgroundImage: `url(${profileImageURL})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <label className="cursor-pointer absolute bottom-0 right-0">
              <FontAwesomeIcon icon={faEdit} />
              <input
                type="file"
                ref={hiddenFileInput}
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </label>
          </div>
        </div>
        <form onSubmit={handleSaveProfile}>
          <div className="mt-32 ml-14">
            <p className="font-bold">
              {username || user?.displayName || user?.email}
            </p>
          </div>
          <div className="mt-4 ml-14">
            <p className="font-medium">Address</p>
            <input
              id="user-address"
              type="text"
              className="user-profile rounded-full px-2"
              value={address}
              onChange={handleChange}
            />
          </div>
          <div className="mt-4 ml-14">
            <p className="font-medium">Name</p>
            <input
              id="user-username"
              type="text"
              className="user-profile rounded-full px-2"
              value={username}
              onChange={handleChange}
            />
          </div>
          <div className="mt-4 ml-14">
            <p className="font-medium">Phone Number</p>
            <input
              id="user-phone"
              type="text"
              className="user-profile rounded-full px-2"
              value={phoneNumber}
              onChange={handleChange}
            />
          </div>
          <div className="mt-4 ml-14">
            <button id="save-profile" type="submit" className="bg-blue-500">
              Save
            </button>
          </div>
        </form>
      </div>
      <div className="w-1/4"></div>
    </div>
  );
};

export default UserProfilePage;
