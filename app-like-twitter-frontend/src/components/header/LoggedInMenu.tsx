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
  const { handleLogout, error } = useLogout(logOutUser);

  const isAtHomePage = pathname === "/logHome";

  const targetRoute = isAtHomePage ? "/logInProfile" : "/logHome";
  const buttonText = isAtHomePage ? "Profile" : "Post Wall";
  const buttonImage = isAtHomePage ? UserAccImg : WebPageImg;
  const buttonAlt = buttonText;

  const handleNavigation = () => {
    navigateTo(targetRoute);
  };

  return (
    <ul className="flex flex-col sm:flex-row bg-lighterDark">
      <li className="flex flex-col items-center p-4 sm:p-6">
        {userNickname.toUpperCase()}
      </li>
      <NavItem
        onClick={handleNavigation}
        imageSrc={buttonImage}
        imageAlt={buttonAlt}
        extraClasses="sm:ml-auto hover:bg-somegray transition delay-125"
        imageWidth={30}
        imageHeight={30}
        buttonClassName="flex w-full sm:w-28 h-full items-center justify-center"
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
        buttonClassName="flex w-28  h-full items-center hover:bg-neutral-800 justify-center rounded-lg bg-somegray"
        extraClasses="sm:ml-auto"
      >
        Logout
      </NavItem>
    </ul>
  );
};

export default LoggedInMenu;
