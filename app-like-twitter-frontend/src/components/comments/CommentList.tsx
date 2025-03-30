import React from "react";
import Comment from "./Comment";
import { CommentListProps } from "@/types/porps/props";

const CommentList: React.FC<CommentListProps> = ({
  comments,
  onUsernameClick,
}) => {
  return (
    <div className="space-y-6">
      {comments
        .slice()
        .reverse()
        .map((comment, index) => (
          <Comment
            key={index}
            comment={comment}
            onUsernameClick={onUsernameClick}
          />
        ))}
    </div>
  );
};

export default CommentList;
