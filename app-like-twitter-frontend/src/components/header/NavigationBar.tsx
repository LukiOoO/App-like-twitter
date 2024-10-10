"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import usePopup from "@/hooks/usePopup";
import LoggedOutMenu from "./LoggedOutMenu";
import LoggedInMenu from "./LoggedInMenu";
import { NavigationBarProps } from "@/types/porps/headerProps";

const NavigationBar: React.FC<NavigationBarProps> = ({
  RegisterShouldPopup,
}) => {
  const { tokenAvailable, userNickname, logOutUser } = useAuth();
  const {
    showPopupRegister,
    showPopupLogin,
    togglePopupLogin,
    togglePopupRegister,
    setShowPopupLogin,
    setShowPopupRegister,
  } = usePopup(RegisterShouldPopup);

  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="w-full h-auto">
      {tokenAvailable ? (
        <LoggedInMenu
          userNickname={userNickname}
          pathname={pathname}
          logOutUser={logOutUser}
        />
      ) : (
        <LoggedOutMenu
          togglePopupLogin={togglePopupLogin}
          togglePopupRegister={togglePopupRegister}
          showPopupLogin={showPopupLogin}
          showPopupRegister={showPopupRegister}
          setShowPopupLogin={setShowPopupLogin}
          setShowPopupRegister={setShowPopupRegister}
        />
      )}
    </div>
  );
};

export default NavigationBar;
