"use client";
import "../globals.css";
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
import Posts from "../../components/Posts";
import { motion, AnimatePresence } from "framer-motion";

export default function PostsWallUndfiend() {
  const [posts, setPosts] = useState<any[]>([]);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const getPosts = async (
    url: string = "http://127.0.0.1:8000/p_w/show_user_posts/"
  ) => {
    try {
      const response = await axios.get(url);

      setPosts((prevPosts) => {
        const existingPostIds = new Set(prevPosts.map((post) => post.post_id));
        const newUniquePosts = response.data.results.filter(
          (post: any) => !existingPostIds.has(post.post_id)
        );

        return [...prevPosts, ...newUniquePosts];
      });

      setNextPage(response.data.next);

      if (!response.data.next) {
        setHasMore(false);
      }
    } catch (error: any) {
      console.error("Error fetching posts:", error);
      setHasMore(false);
    }
  };

  const getPostComments = async (post_id: number): Promise<any[]> => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/p_w/show_user_posts/${post_id}/comments/`
      );

      return response.data;
    } catch (error: any) {
      console.log(error);
      return [];
    }
  };
  const [commentsByPost, setCommentsByPost] = useState<{
    [key: number]: any[];
  }>({});

  useEffect(() => {
    const fetchComments = async () => {
      const commentsMap: { [key: number]: any[] } = {};

      await Promise.all(
        posts.map(async (postObj: any) => {
          const comments = await getPostComments(postObj.post_id);
          commentsMap[postObj.post_id] = comments;
        })
      );
      setCommentsByPost(commentsMap);
    };
    if (posts.length > 0) {
      fetchComments();
    }
  }, [posts]);
  console.log(posts);

  useEffect(() => {
    getPosts();
  }, []);

  const fetchMorePosts = () => {
    if (nextPage) {
      getPosts(nextPage);
    }
  };
  const [shouldPopUp, setShouldPopUp] = useState(false);
  const toggleShouldPopUp = () => {
    setShouldPopUp((prev) => !prev);
  };
  useEffect(() => {
    if (shouldPopUp) {
      setShouldPopUp(false);
    }
  }, [shouldPopUp]);

  return (
    <div>
      <Header RegisterShouldPopup={shouldPopUp} />
      <Toaster />
      <div className="flex flex-col sm:flex-row ">
        <div className="w-full sm:w-4/5 flex h-screen border-x-4 border-lighterDark">
          <div className="w-4/5 mx-auto flex justify-center mt-5 sm:mt-5">
            <div
              id="scrollableDiv"
              className="flex-1 overflow-y-auto scrollbar-hide sm:w-[60%] sm:mx-auto"
              style={{ height: "90vh" }}
            >
              <InfiniteScroll
                dataLength={posts.length}
                next={fetchMorePosts}
                hasMore={hasMore}
                loader={
                  <h4 className="text-center text-gray-400">Loading...</h4>
                }
                endMessage={
                  <p className="text-center text-gray-400">
                    <b>No more posts to display</b>
                  </p>
                }
                scrollableTarget="scrollableDiv"
              >
                {posts.length > 0 ? (
                  <div className="space-y-6">
                    {posts.map((postObj: any, index: number) => {
                      return (
                        <div
                          key={index}
                          className="sm:w-[80%] xl:w-[60%] sm:mx-auto bg-gradient-to-r from-lighterDark to-gray-900 p-8 rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 ease-out min-h-[200px] flex flex-col"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <p
                              className="font-semibold text-sm hover:text-teal-600 cursor-pointer"
                              onClick={toggleShouldPopUp}
                            >
                              {postObj.user}
                            </p>
                            <p className="text-xs text-teal-600">
                              {postObj.tags.join(" ")}
                            </p>
                            <div className="text-gray-400 text-xs">
                              {new Date(
                                postObj.created_at
                              ).toLocaleDateString()}
                              {new Date(
                                postObj.created_at
                              ).toLocaleTimeString()}
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
                                src={EmptyHear}
                                width={24}
                                onClick={toggleShouldPopUp}
                                height={24}
                                className="cursor-pointer"
                              />
                              <p>Likes: {postObj.likes.count || 0}</p>
                              <Image
                                src={CommIc}
                                onClick={toggleShouldPopUp}
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
                              onClick={toggleShouldPopUp}
                            >
                              Liked by
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-6 text-center sm:w-full sm:h-full">
                    <p className="font-semibold text-gray-500">
                      No matches found
                    </p>
                  </div>
                )}
              </InfiniteScroll>
            </div>
          </div>
        </div>
        <div className="w-full sm:w-1/5 h-screen text-center border-lighterDark border-r-4">
          <div className="p-4">
            <h2 className="font-semibold mb-2">Search:</h2>
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Type tag/user"
                className="w-full p-2 pl-10 bg-lighterDark text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                onClick={toggleShouldPopUp}
              />
              <svg
                className="w-6 h-6 absolute left-2 top-2 text-gray-400 cursor-pointer"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                onClick={toggleShouldPopUp}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
