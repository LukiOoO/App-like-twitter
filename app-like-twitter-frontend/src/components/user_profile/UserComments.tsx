import React from "react";
import CommentList from "./../comments/CommentList";
import { UserCommentsProps } from "@/types/porps/props";
import { emptyFunction } from "@/utils/emptyFunction";

const UserComments: React.FC<UserCommentsProps> = ({ userComments }) => {
  return (
    <div className="flex-1 sm:h-2/3 mt-4 sm:mt-0">
      <span className="text-2xl font-bold text-slate-600 block mb-1 animate-pulse text-center">
        User Comments
      </span>
      <div className="flex-1 overflow-y-auto scrollbar-hide h-[85%] sm:h-[85%] sm:w-[90%] sm:mx-auto">
        {userComments.length > 0 ? (
          <CommentList
            comments={userComments}
            onUsernameClick={emptyFunction}
          />
        ) : (
          <div>
            <p className="text-center font-semibold text-gray-500">
              No matches found
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserComments;
