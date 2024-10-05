"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import usePopup from "@/hooks/usePopup";
import LoggedInMenu from "./LoggedInMenu";
import LoggedOutMenu from "./LoggedOutMenu";

type Props = {
  RegisterShouldPopup: boolean;
};

const Header: React.FC<Props> = ({ RegisterShouldPopup }) => {
  const router = useRouter();
  const pathname = usePathname();

  const { tokenAvailable, userNickname, logOutUser } = useAuth();

  const {
    showPopupRegister,
    showPopupLogin,
    togglePopupLogin,
    togglePopupRegister,
    setShowPopupLogin,
    setShowPopupRegister,
  } = usePopup(RegisterShouldPopup);

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

export default Header;
