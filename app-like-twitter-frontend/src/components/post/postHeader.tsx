"use client";

import React from "react";
import { PostHeaderProps } from "@/types/porps/props";

const PostHeader: React.FC<PostHeaderProps> = ({
  user,
  tags,
  createdAt,
  onUsernameClick,
}) => {
  return (
    <div className="flex justify-between items-center mb-2">
      <p
        className="font-semibold text-sm hover:text-teal-600 cursor-pointer"
        onClick={onUsernameClick}
      >
        {user}
      </p>
      <p className="text-xs text-teal-600">{tags.join(" ")}</p>
      <div className="text-gray-400 text-xs">
        {new Date(createdAt).toLocaleDateString()}{" "}
        {new Date(createdAt).toLocaleTimeString()}
      </div>
    </div>
  );
};

export default PostHeader;
