"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Header from "@/components/header/Header";
import axios from "axios";
import Cookies from "js-cookie";
import toast, { Toaster } from "react-hot-toast";
import jwt, { JwtPayload } from "jsonwebtoken";
import Post from "@/components/post/Post";
import PostEditForm from "@/components/post_post/PostEditForm";
import CommentList from "@/components/comments/CommentList";
import CreateComment from "@/app/commentWindow/commentWindow";
import { PostObj } from "@/types/interfaces/interfaces";
import { emptyFunction } from "@/utils/emptyFunction";
import Button from "@/components/common/Button";

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
      const response = await axios.get(
        `http://127.0.0.1:8000/p_w/post-detail/?post_id=${id}`,
        { headers: { Authorization: `JWT ${Cookies.get("access")}` } }
      );
      if (response.data && response.data.length > 0) {
        setPost(response.data[0]);
      } else {
        setPost(null);
        toast.error("Post not found.");
      }
    } catch (error: any) {
      console.log(error);
      toast.error("An error occurred while fetching the post.");
    }
  };

  const fetchPostComments = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/p_w/show_user_posts/${id}/comments/`,
        { headers: { Authorization: `JWT ${Cookies.get("access")}` } }
      );
      setComments(response.data);
    } catch (error: any) {
      console.log(error);
      toast.error("An error occurred while fetching comments.");
    }
  };

  const toggleEditing = () => {
    setIsEditing((prev) => !prev);
  };

  const moveToUserProfile = (nickname: string) => {
    router.push(`/userProfile/${nickname}`);
  };

  const followUnFollow = async () => {
    if (!id) {
      toast.error("Invalid post ID.");
      return;
    }
    try {
      await axios.post(
        "http://127.0.0.1:8000/p_w/show_user_posts/",
        { follow_unfollow_post: id },
        { headers: { Authorization: `JWT ${Cookies.get("access")}` } }
      );
      await fetchPostDetail();
    } catch (error: any) {
      console.log(error);
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
        <div className="w-full sm:w-2/3 flex flex-col">
          {post ? (
            <>
              {!isEditing ? (
                <Post
                  postObj={post}
                  commentsByPost={{ [post.post_id]: comments }}
                  onLikeClick={followUnFollow}
                  onCommentClick={togglePopupCreateCom}
                  onLikedByClick={togglePopupLikedBy}
                  onUsernameClick={() => moveToUserProfile(post.user)}
                  currentUserNickname={nick}
                  likedByPopupPostId={likedByPopupPostId}
                  imageClass={post.image || ""}
                  gifClass={post.gif || ""}
                  videoClass={post.video || ""}
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
                    buttonClassName="text-gray-300 bg-lighterDark hover:bg-gray-800 px-4 py-2 rounded-lg shadow"
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
                onUsernameClick={moveToUserProfile}
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
