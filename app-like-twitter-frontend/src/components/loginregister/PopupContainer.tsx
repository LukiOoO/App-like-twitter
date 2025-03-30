import React from "react";
import { PopupContainerProps } from "@/types/porps/props";

const PopupContainer: React.FC<PopupContainerProps> = ({
  children,
  togglePopup,
}) => {
  return (
    <div
      className="fixed top-0 left-0 z-50 w-full h-full bg-black bg-opacity-75 flex items-center justify-center"
      onClick={togglePopup}
    >
      <div
        className="bg-somegray p-10 rounded-lg shadow-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default PopupContainer;
