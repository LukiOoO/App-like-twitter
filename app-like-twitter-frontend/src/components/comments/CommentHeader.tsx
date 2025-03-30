import React from "react";
import { CommentHeaderProps } from "@/types/porps/props";

const CommentHeader: React.FC<CommentHeaderProps> = ({
  comment,
  onUsernameClick,
}) => {
  return (
    <div className="flex justify-between items-center mb-2">
      <p
        className="text-xs font-semibold hover:text-teal-600 cursor-pointer"
        onClick={() => onUsernameClick(comment.user_nickname)}
      >
        {comment.user_nickname}
      </p>
      <div className="text-gray-400 text-xs">
        {new Date(comment.created_at).toLocaleDateString()}{" "}
        {new Date(comment.created_at).toLocaleTimeString()}
      </div>
    </div>
  );
};

export default CommentHeader;
