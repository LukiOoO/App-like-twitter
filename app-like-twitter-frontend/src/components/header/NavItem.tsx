"use client";

import "@/app/globals.css";
import React, { ReactNode, ComponentType } from "react";
import { StaticImageData } from "next/image";
import Button from "../common/Button";

interface NavItemProps {
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
}

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
