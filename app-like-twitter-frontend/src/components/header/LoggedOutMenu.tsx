"use client";

import React from "react";
import NavItem from "./NavItem";
import Login from "@/app/login/loginWIndow";
import Register from "@/app/register/registerWindow";
import LoginImg from "@/assets/login.png";
import RegisterImg from "@/assets/register.png";
import { LoggedOutMenuProps } from "@/types/porps/props";

const LoggedOutMenu: React.FC<LoggedOutMenuProps> = ({
  togglePopupLogin,
  togglePopupRegister,
  showPopupLogin,
  showPopupRegister,
  setShowPopupLogin,
  setShowPopupRegister,
}) => (
  <ul className="flex flex-col sm:flex-row bg-gray-900 shadow-lg">
    <NavItem
      extraClasses="hover:bg-gray-800 transition-colors duration-150 rounded-lg"
      buttonClassName="flex w-full sm:w-28 h-full items-center justify-center text-white"
      onClick={togglePopupLogin}
      imageSrc={LoginImg}
      imageAlt="Login"
      showPopup={showPopupLogin}
      PopupComponent={Login}
      popupProps={{
        togglePopup: togglePopupLogin,
      }}
      imageWidth={30}
      imageHeight={30}
    >
      Login
    </NavItem>
    <NavItem
      extraClasses="hover:bg-gray-800 transition-colors duration-150 rounded-lg"
      buttonClassName="flex w-full sm:w-28 h-full items-center justify-center text-white"
      onClick={togglePopupRegister}
      imageSrc={RegisterImg}
      imageAlt="Register"
      showPopup={showPopupRegister}
      PopupComponent={Register}
      popupProps={{
        togglePopup: togglePopupRegister,
        setShowPopupLogin: setShowPopupLogin,
        setShowPopupRegister: setShowPopupRegister,
      }}
      imageWidth={30}
      imageHeight={30}
    >
      Register
    </NavItem>
  </ul>
);

export default LoggedOutMenu;
