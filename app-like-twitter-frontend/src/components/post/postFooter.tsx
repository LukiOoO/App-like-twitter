"use client";

import React from "react";
import Button from "../common/Button";
import Image from "next/image";
import FullHeartIcon from "@/assets/Follows.png";
import EmptyHeartIcon from "@/assets/Nofollows.png";
import CommentIcon from "@/assets/comment.png";
import { formatNumber } from "@/utils/formatNumber";
import { PostFooterProps } from "@/types/porps/props";

const PostFooter: React.FC<PostFooterProps> = ({
  likesCount,
  commentsCount,
  onLikeClick,
  onCommentClick,
  onLikedByClick,
  userHasLikedPost,
}) => {
  return (
    <div className="flex justify-between items-center text-xs text-gray-400">
      <div className="flex items-center space-x-2">
        <div onClick={onLikeClick} className="cursor-pointer">
          <Image
            alt="Like/Unlike"
            src={userHasLikedPost ? FullHeartIcon : EmptyHeartIcon}
            width={24}
            height={24}
          />
        </div>
        <p>Likes: {formatNumber(likesCount)}</p>
        <Image
          src={CommentIcon}
          width={24}
          height={24}
          alt="Comment Icon"
          onClick={onCommentClick}
          className="cursor-pointer"
        />
        <p>Comments: {formatNumber(commentsCount)}</p>
      </div>
      <Button buttonClassName="cursor-pointer" onClick={onLikedByClick}>
        Liked by
      </Button>
    </div>
  );
};

export default PostFooter;
