"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Cookies from "js-cookie";
import toast, { Toaster } from "react-hot-toast";
import jwt, { JwtPayload } from "jsonwebtoken";

import Header from "@/components/header/Header";
import Button from "@/components/common/Button";
import Post from "@/components/post/Post";
import PostEditForm from "@/components/post_post/PostEditForm";
import CommentList from "@/components/comments/CommentList";
import CreateComment from "@/app/commentWindow/commentWindow";

import { PostObj } from "@/types/interfaces/interfaces";

import { emptyFunction } from "@/utils/emptyFunction";
import { moveToUserProfile } from "@/utils/redirects";

import {
  getPostDetailApi,
  getPostDetailsCommentsApi,
  followUnfollowApi,
} from "@/utils/api";

export default function PostDetailsContainer() {
  const router = useRouter();
  const pathname = usePathname();
  const id = pathname.split("/")[2];
  const nick = Cookies.get("Nick");

  const [post, setPost] = useState<PostObj | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [createComWinpopup, setCreateComWinpopup] = useState(false);
  const [likedByPopupPostId, setLikedByPopupPostId] = useState<number | null>(
    null
  );

  const fetchPostDetail = async () => {
    try {
      const data = await getPostDetailApi(id);
      if (data && data.length > 0) {
        setPost(data[0]);
      } else {
        setPost(null);
        toast.error("Post not found.");
      }
    } catch (error: any) {
      console.error(error);
      toast.error("An error occurred while fetching the post.");
    }
  };

  const fetchPostComments = async () => {
    try {
      const data = await getPostDetailsCommentsApi(id);
      setComments(data);
    } catch (error: any) {
      console.error(error);
      toast.error("An error occurred while fetching comments.");
    }
  };

  const toggleEditing = () => {
    setIsEditing((prev) => !prev);
  };

  const followUnFollow = async () => {
    if (!id) {
      toast.error("Invalid post ID.");
      return;
    }
    try {
      await followUnfollowApi(id);
      await fetchPostDetail();
    } catch (error: any) {
      console.error(error);
      toast.error("An error occurred while following/unfollowing.");
    }
  };

  const togglePopupCreateCom = () => {
    setCreateComWinpopup((prev) => !prev);
  };

  const togglePopupLikedBy = (postId?: number | null): void => {
    setLikedByPopupPostId(postId || null);
  };

  useEffect(() => {
    fetchPostDetail();
    fetchPostComments();
  }, []);

  const decodedToken = jwt.decode(
    Cookies.get("access") || ""
  ) as JwtPayload | null;

  return (
    <div>
      <Toaster />
      <Header registerShouldPopup={false} />
      <div className="flex flex-col sm:flex-row sm:justify-between m-5 space-y-4 sm:space-y-0 sm:space-x-4 h-screen">
        <div className="w-full sm:w-2/3 flex flex-col ">
          {post ? (
            <>
              {!isEditing ? (
                <Post
                  postObj={post}
                  commentsByPost={{ [post.post_id]: comments }}
                  onLikeClick={followUnFollow}
                  onCommentClick={togglePopupCreateCom}
                  onLikedByClick={togglePopupLikedBy}
                  onUsernameClick={() => moveToUserProfile(router, post.user)}
                  currentUserNickname={nick}
                  likedByPopupPostId={likedByPopupPostId}
                  imageClass={"image-item"}
                  gifClass={"gif-item"}
                  videoClass={"video-item"}
                  onPostClick={emptyFunction}
                />
              ) : (
                <PostEditForm
                  post={post}
                  refreshPost={fetchPostDetail}
                  cancelEdit={toggleEditing}
                />
              )}
              {post.user_id === decodedToken?.user_id && (
                <div className="mb-4 text-center">
                  <Button
                    buttonClassName="m-5 text-gray-300 bg-lighterDark hover:bg-gray-800 px-4 py-2 rounded-lg shadow"
                    onClick={toggleEditing}
                  >
                    {isEditing ? "Cancel" : "Edit Post"}
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div>No matches found</div>
          )}
        </div>
        <div className="w-full sm:w-1/3 flex flex-col">
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            {comments && comments.length > 0 ? (
              <CommentList
                comments={comments}
                onUsernameClick={() => moveToUserProfile}
              />
            ) : (
              <div>No comments found</div>
            )}
            {createComWinpopup && (
              <CreateComment
                id={id}
                togglePopup={togglePopupCreateCom}
                postComments={fetchPostComments}
                setcreateComWinpopup={setCreateComWinpopup}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
