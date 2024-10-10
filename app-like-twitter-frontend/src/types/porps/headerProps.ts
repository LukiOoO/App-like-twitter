import { StaticImageData } from "next/image";
import React, { ReactNode } from "react";

export type HeaderProps = {
  registerShouldPopup: boolean;
};

export type LoggedInMenuProps = {
  userNickname: string;
  pathname: string;
  logOutUser: () => void;
};

export type LoggedOutMenuProps = {
  togglePopupLogin: () => void;
  togglePopupRegister: () => void;
  showPopupLogin: boolean;
  showPopupRegister: boolean;
  setShowPopupLogin: React.Dispatch<React.SetStateAction<boolean>>;
  setShowPopupRegister: React.Dispatch<React.SetStateAction<boolean>>;
};

export type NavigationBarProps = {
  RegisterShouldPopup: boolean;
};

export type NavItemProps = {
  onClick: () => void;
  children: ReactNode;
  imageSrc: string | StaticImageData;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
  extraClasses?: string;
  buttonClassName?: string;
  showPopup?: boolean;
  PopupComponent?: React.FC<any>;
  popupProps?: any;

  [key: string]: any;
};
