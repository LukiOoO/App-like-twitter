"use client";

import React from "react";
import PostHeader from "./postHeader";
import PostBody from "./postBody";
import PostFooter from "./postFooter";
import LikedBy from "@/app/likedBy/likedByWindow";
import { usePostActions } from "@/hooks/userPostAction";
import { PostProps } from "@/types/porps/props";
import { useIsAuthenticated } from "@/hooks/useIsAuthenticated";

const Post: React.FC<PostProps> = ({
  postObj,
  extraPostClasses,
  currentUserNickname,
  commentsByPost,
  onPostClick,
  onUsernameClick,
  onLikeClick,
  onCommentClick,
  onLikedByClick,
  likedByPopupPostId,
}) => {
  const userHasLikedPost = currentUserNickname
    ? postObj.likes?.liked_by?.includes(currentUserNickname)
    : false;

  const isAuthenticated = useIsAuthenticated();

  const {
    handlePostClick,
    handleUsernameClick,
    handleLikeClick,
    handleCommentClick,
    handleLikedByClick,
  } = usePostActions({
    onPostClick,
    onUsernameClick,
    onLikeClick,
    onCommentClick,
    onLikedByClick,
    postId: postObj.post_id,
    isAuthenticated,
    currentUserNickname,
  });

  return (
    <div
      className={`min-h-[250px] sm:mx-auto sm:w-[80%] xl:w-[60%] bg-gradient-to-r from-lighterDark to-gray-900 p-8 rounded-xl shadow-xl hover:shadow-2xl transform  sm:flex sm:flex-col   min-w-[300px] ${extraPostClasses}`}
      onClick={() => handlePostClick(postObj.post_id)}
    >
      <PostHeader
        user={postObj.user}
        tags={postObj.tags}
        createdAt={postObj.created_at}
        onUsernameClick={() => handleUsernameClick(postObj.user)}
      />
      <div className="flex-grow">
        <PostBody
          text={postObj.text}
          image={postObj.image}
          gif={postObj.gif}
          video={postObj.video}
        />
      </div>
      <PostFooter
        likesCount={postObj.likes.count}
        commentsCount={commentsByPost[postObj.post_id]?.length || 0}
        onLikeClick={(e) => {
          e.stopPropagation();
          handleLikeClick(postObj.post_id);
        }}
        onCommentClick={() => {
          handleCommentClick(postObj.post_id);
        }}
        onLikedByClick={() => {
          handleLikedByClick(postObj.post_id);
        }}
        userHasLikedPost={userHasLikedPost}
      />
      {likedByPopupPostId === postObj.post_id && (
        <LikedBy
          postId={postObj.post_id}
          togglePopup={() => onLikedByClick()}
          likeUsers={postObj.likes.liked_by}
        />
      )}
    </div>
  );
};

export default Post;
