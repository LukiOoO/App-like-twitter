"use client";

import React from "react";
import UniversalMedia from "../common/UniversalMedia";
import { PostBodyProps } from "@/types/porps/props";

const PostBody: React.FC<PostBodyProps> = ({ text, image, gif, video }) => {
  return (
    <>
      <div className="mb-4">
        <p className="text-gray-200 text-sm break-all text-center">{text}</p>
      </div>
      <div className="flex flex-col items-center gap-4 mb-4">
        <UniversalMedia image={image} gif={gif} video={video} />
      </div>
    </>
  );
};

export default PostBody;
