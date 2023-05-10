import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Transition } from "@headlessui/react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

import { getAuth, User, signOut } from "firebase/auth";

interface UserDropdownProps {
  user: any; // สามารถเปลี่ยน any เป็นชนิดของ user ได้
}

const UserDropdown: React.FC<UserDropdownProps> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [logoutUser, setLogoutUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const auth = getAuth();

  const handleProfileClick = () => {
    navigate(`/profile`);
  };

  const handleLogoutClick = async () => {
    try {
      await signOut(auth);
      setLogoutUser(null);
      console.log("Logout Complete!!");
      navigate(`/`);
      window.location.reload();
    } catch (error) {
      console.error((error as Error).message);
    }
  };

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <Menu as="div" className="relative inline-block">
      <div
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <Menu.Button className="font-bold cursor-pointer">
          {user.displayName || user.email}
          <FontAwesomeIcon
            icon={faChevronDown}
            style={{ color: "var(--white)" }}
          />
        </Menu.Button>
      </div>

      <div
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <Transition
          show={isOpen}
          as={React.Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 z-10 py-2 w-52 bg-white rounded-md shadow-lg focus:outline-none">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={handleProfileClick}
                  className={`${
                    active ? "bg-gray-100" : ""
                  } block w-full text-left px-4 py-2 text-sm text-gray-700`}
                >
                  Profile
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={handleLogoutClick}
                  className={`${
                    active ? "bg-gray-100" : ""
                  } block w-full text-left px-4 py-2 text-sm text-gray-700`}
                >
                  Logout
                </button>
              )}
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </div>
    </Menu>
  );
};

export default UserDropdown;
