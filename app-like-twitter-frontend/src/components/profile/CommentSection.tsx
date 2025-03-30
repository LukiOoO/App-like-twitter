import React from "react";
import EditCommentWindow from "@/app/editCommentWindow/editCommentWindow";
import { CommentsSectionProps } from "@/types/porps/props";

const CommentsSection: React.FC<CommentsSectionProps> = ({
  comments,
  onPostClick,
  setIsEditingComment,
  isEditingComment,
  togglePopupEditCom,
  handleRedirectCLik,
  getUserComments,
}) => {
  return (
    <div className="h-2/6 sm:h-1/2 text-center border-lighterDark p-4">
      <span className="text-2xl font-bold text-slate-600 block mb-1 animate-pulse">
        Your comments:
      </span>
      {comments ? (
        <div className="h-[95%] overflow-y-scroll scrollbar-hide space-y-6">
          {comments
            .slice()
            .reverse()
            .map((commentObj: any, index: number) => (
              <div
                key={index}
                className="flex items-center justify-around space-x-2"
              >
                <div
                  onClick={() => onPostClick(commentObj.post_id)}
                  className="bg-gradient-to-tl from-lighterDark to-gray-950 p-8 rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 ease-out w-[90%]"
                >
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-xs font-semibold">
                      {commentObj.user_nickname}
                    </p>
                    <div className="text-gray-400 text-xs">
                      {new Date(commentObj.created_at).toLocaleDateString()}
                      {new Date(commentObj.created_at).toLocaleTimeString()}
                    </div>
                  </div>
                  <p className="text-sm mb-4">{commentObj.text}</p>
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    {commentObj.image && (
                      <img
                        src={commentObj.image}
                        alt="Comment Image"
                        className="rounded-md shadow-lg object-cover w-24 h-24 sm:w-32 sm:h-32"
                      />
                    )}
                    {commentObj.gif && (
                      <img
                        src={commentObj.gif}
                        alt="Comment GIF"
                        className="rounded-md shadow-md object-cover w-24 h-24 sm:w-32 sm:h-32"
                      />
                    )}
                    {commentObj.video && (
                      <video
                        src={commentObj.video}
                        controls
                        className="rounded-md shadow-lg w-24 h-24 sm:w-32 sm:h-32"
                      />
                    )}
                  </div>
                </div>
                <button
                  className="text-gray-300 bg-lighterDark hover:bg-gray-800 px-4 py-2 rounded-lg shadow [writing-mode:vertical-lr] [text-orientation:upright]"
                  onClick={() => {
                    setIsEditingComment({
                      editComment: true,
                      comment_id: commentObj.id,
                    });
                  }}
                >
                  {isEditingComment.editComment &&
                  commentObj.id === isEditingComment.comment_id
                    ? "Cancel"
                    : "Edit"}
                </button>
                {isEditingComment.editComment &&
                  commentObj.id === isEditingComment.comment_id && (
                    <EditCommentWindow
                      togglePopup={togglePopupEditCom}
                      setIsEditingComment={setIsEditingComment}
                      getUserComments={getUserComments}
                      commentObj={commentObj}
                    />
                  )}
              </div>
            ))}
        </div>
      ) : (
        <div>No matches found</div>
      )}
    </div>
  );
};

export default CommentsSection;
