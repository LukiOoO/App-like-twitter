import React from "react";
import CommentBody from "./CommentBody";
import CommentHeader from "./CommentHeader";
import { CommentProps } from "@/types/porps/props";

const Comment: React.FC<CommentProps> = ({ comment, onUsernameClick }) => {
  return (
    <div className="bg-gradient-to-tl from-lighterDark to-gray-950 p-6 rounded-xl shadow-xl">
      <CommentHeader comment={comment} onUsernameClick={onUsernameClick} />
      <CommentBody comment={comment} />
    </div>
  );
};

export default Comment;
