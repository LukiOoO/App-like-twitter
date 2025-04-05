"use client";

import React from "react";
import useNavigation from "@/hooks/useNavigation";
import useLogout from "@/hooks/useLogout";
import NavItem from "./NavItem";
import UserAccImg from "@/assets/useracc.png";
import WebPageImg from "@/assets/webpage.png";
import LogOutImg from "@/assets/logout.png";
import { LoggedInMenuProps } from "@/types/porps/props";

const LoggedInMenu: React.FC<LoggedInMenuProps> = ({
  userNickname,
  pathname,
  logOutUser,
}) => {
  const { navigateTo } = useNavigation();
  const { handleLogout } = useLogout(logOutUser);

  const isAtHomePage = pathname === "/logHome";
  const targetRoute = isAtHomePage ? "/logInProfile" : "/logHome";
  const buttonText = isAtHomePage ? "Profile" : "Post Wall";
  const buttonImage = isAtHomePage ? UserAccImg : WebPageImg;
  const buttonAlt = buttonText;

  const handleNavigation = () => {
    navigateTo(targetRoute);
  };

  return (
    <ul className="flex flex-col sm:flex-row bg-gray-900 shadow-lg">
      <li className="flex flex-col items-center p-4 sm:p-6 hover:bg-gray-800 transition-colors duration-150">
        <span className="text-white font-medium">
          {userNickname.toUpperCase()}
        </span>
      </li>
      <NavItem
        onClick={handleNavigation}
        imageSrc={buttonImage}
        imageAlt={buttonAlt}
        extraClasses="hover:bg-gray-800 transition-colors duration-150 rounded-lg"
        imageWidth={30}
        imageHeight={30}
        buttonClassName="flex w-full sm:w-28 h-full items-center justify-center text-white"
        showPopup={false}
      >
        {buttonText}
      </NavItem>
      <NavItem
        onClick={handleLogout}
        imageSrc={LogOutImg}
        imageAlt="Logout"
        imageWidth={20}
        imageHeight={20}
        buttonClassName="flex w-full sm:w-28 h-full items-center justify-center text-white hover:bg-gray-800 transition-colors duration-150 rounded-lg"
        extraClasses="hover:bg-gray-800 transition-colors duration-150 rounded-lg"
      >
        Logout
      </NavItem>
    </ul>
  );
};

export default LoggedInMenu;
