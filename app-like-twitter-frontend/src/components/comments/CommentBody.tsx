import React from "react";
import { CommentBodyProps } from "@/types/porps/props";
import Media from "@/components/common/UniversalMedia";

const CommentBody: React.FC<CommentBodyProps> = ({ comment }) => {
  return (
    <div>
      <p className="text-sm mb-4">{comment.text}</p>
      <Media
        image={comment.image}
        gif={comment.gif}
        video={comment.video}
        imageClass="rounded-md shadow-lg object-cover w-24 h-24 sm:w-32 sm:h-32"
        gifClass="rounded-md shadow-md object-cover w-24 h-24 sm:w-32 sm:h-32"
        videoClass="rounded-md shadow-lg w-24 h-24 sm:w-32 sm:h-32"
      />
    </div>
  );
};

export default CommentBody;
