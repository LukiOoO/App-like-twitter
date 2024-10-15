"use client";

import "@/app/globals.css";
import React from "react";
import Button from "../common/Button";
import { NavItemProps } from "@/types/porps/props";

const NavItem: React.FC<NavItemProps> = ({
  onClick,
  children,
  imageSrc,
  imageAlt,
  imageWidth,
  imageHeight,
  extraClasses,
  buttonClassName,
  showPopup,
  PopupComponent,
  popupProps = {},
  ...rest
}) => {
  return (
    <li className={`flex flex-col items-center p-4 sm:p-6 ${extraClasses}`}>
      <Button
        buttonClassName={`${buttonClassName}`}
        onClick={onClick}
        ariaLabel={imageAlt}
        imageSrc={imageSrc}
        imageWidth={imageWidth}
        imageHeight={imageHeight}
        imageAlt={imageAlt}
      >
        {children}
      </Button>
      {showPopup && PopupComponent && <PopupComponent {...popupProps} />}
    </li>
  );
};

export default NavItem;
