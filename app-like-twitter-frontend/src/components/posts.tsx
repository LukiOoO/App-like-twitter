"use client";

import "@/app/globals.css";
import Header from "@/components/header/Header";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import LikedBy from "@/app/likedBy/likedByWindow";
import FindTags from "@/app/findTagsWindow/findTagsWindow";
import EmptyHear from "@/assets/Nofollows.png";
import FullHear from "@/assets/Follows.png";
import Image from "next/image";
import RemoveIc from "@/assets/remove.png";
import Pencil from "@/assets/pencil.png";
import CreateTag from "@/app/createTagWindow/createTagWindow";
import toast, { Toaster } from "react-hot-toast";
import CommIc from "@/assets/comment.png";
import CreateComment from "@/app/commentWindow/commentWindow";
import jwt from "jsonwebtoken";
import AnonymusImg from "@/assets/anonymous.png";
import AddPost from "@/app/addPostWIndow/addPostWindow";
import InfiniteScroll from "react-infinite-scroll-component";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  posts: any[];
  fetchMorePosts: () => void;
  hasMore: boolean;
  isSearch: boolean;
  currentUserNickname: string;
  commentsByPost: { [key: number]: any[] };
  moveToUserProfile: (nickname: string) => void;
  setPosts: React.Dispatch<React.SetStateAction<any[]>>;
  handleRedirectClick: (postId: number) => void;
  likedByPopupPostId: number | null;
  togglePopupLikedBy: (postId: number | null) => void;
};

export default function PostsList({
  posts,
  fetchMorePosts,
  hasMore,
  isSearch,
  currentUserNickname,
  commentsByPost,
  moveToUserProfile,
  handleRedirectClick,
  likedByPopupPostId,
  togglePopupLikedBy,
  setPosts,
}: Props) {
  const handleLike = async (post_id: number) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/p_w/show_user_posts/",
        { follow_unfollow_post: post_id },
        {
          headers: { Authorization: `JWT ${Cookies.get("access")}` },
        }
      );

      console.log("Response from like/unlike:", response.data);

      const action = response.data.detail;

      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post.post_id === post_id) {
            let updatedLikedBy = post.likes?.liked_by || [];
            let updatedCount = post.likes?.count || 0;

            if (action === "Follow post successfuly") {
              if (!updatedLikedBy.includes(currentUserNickname)) {
                updatedLikedBy = [...updatedLikedBy, currentUserNickname];
                updatedCount += 1;
              }
            } else if (action === "Unfollowed post successfuly") {
              if (updatedLikedBy.includes(currentUserNickname)) {
                updatedLikedBy = updatedLikedBy.filter(
                  (nick: string) => nick !== currentUserNickname
                );
                updatedCount -= 1;
              }
            }

            return {
              ...post,
              likes: {
                liked_by: updatedLikedBy,
                count: updatedCount,
              },
            };
          } else {
            return post;
          }
        })
      );
    } catch (error) {
      console.error("Error liking/unliking post:", error);
    }
  };
  const variants = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 100 },
  };

  return (
    <InfiniteScroll
      dataLength={posts.length}
      next={fetchMorePosts}
      hasMore={hasMore}
      loader={<h4 className="text-center text-gray-400">Loading...</h4>}
      endMessage={
        <p className="text-center text-gray-400">
          {!isSearch && <b>No more posts to display</b>}
        </p>
      }
      scrollableTarget="scrollableDiv"
    >
      {posts.length > 0 ? (
        <AnimatePresence>
          <div className="space-y-6">
            {posts.map((postObj: any) => {
              const userHasLikedPost =
                postObj.likes?.liked_by?.includes(currentUserNickname);
              return (
                <motion.div
                  key={postObj.post_id}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={variants}
                  transition={{ duration: 0.5 }}
                >
                  <div className="sm:w-[80%] xl:w-[60%] sm:mx-auto bg-gradient-to-r from-lighterDark to-gray-900 p-8 rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 ease-out min-h-[200px] flex flex-col">
                    <div className="flex justify-between items-center mb-2">
                      <p
                        className="font-semibold text-sm hover:text-teal-600 cursor-pointer"
                        onClick={() => moveToUserProfile(postObj.user)}
                      >
                        {postObj.user}
                      </p>
                      <p className="text-xs text-teal-600">
                        {postObj.tags.join(" ")}
                      </p>
                      <div className="text-gray-400 text-xs">
                        {new Date(postObj.created_at).toLocaleDateString()}
                        {new Date(postObj.created_at).toLocaleTimeString()}
                      </div>
                    </div>

                    <div className="flex-grow">
                      <div className="mb-4">
                        <p className="text-gray-200 text-sm break-all">
                          {postObj.text}
                        </p>
                      </div>
                      <div className="flex flex-col items-center gap-4 mb-4">
                        {postObj.image && (
                          <img
                            src={postObj.image}
                            alt="Post Image"
                            className="rounded-md shadow-lg object-cover w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48"
                          />
                        )}
                        {postObj.gif && (
                          <img
                            src={postObj.gif}
                            alt="Post GIF"
                            className="rounded-md shadow-md object-cover w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48"
                          />
                        )}
                        {postObj.video && (
                          <video
                            src={postObj.video}
                            controls
                            className="rounded-md shadow-lg w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48"
                          />
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-xs text-gray-400">
                      <div className="flex items-center space-x-2">
                        <Image
                          alt="Like/Unlike"
                          src={userHasLikedPost ? FullHear : EmptyHear}
                          width={24}
                          onClick={() => handleLike(postObj.post_id)}
                          height={24}
                          className="cursor-pointer"
                        />
                        <p>Likes: {postObj.likes.count || 0}</p>
                        <Image
                          src={CommIc}
                          onClick={() => handleRedirectClick(postObj.post_id)}
                          width={24}
                          height={24}
                          alt="Comment Icon"
                          className="cursor-pointer"
                        />
                        <p>
                          Comments:
                          {commentsByPost[postObj.post_id]?.length || 0}
                        </p>
                      </div>
                      <button
                        className="cursor-pointer"
                        onClick={() => togglePopupLikedBy(postObj.post_id)}
                      >
                        Liked by
                      </button>
                      {likedByPopupPostId === postObj.post_id && (
                        <LikedBy
                          postId={postObj.post_id}
                          togglePopup={() => togglePopupLikedBy(null)}
                          likeUsers={postObj.likes.liked_by}
                        />
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </AnimatePresence>
      ) : (
        <div className="p-6 text-center sm:w-full sm:h-full">
          <p className="font-semibold text-gray-500">No matches found</p>
        </div>
      )}
    </InfiniteScroll>
  );
}
