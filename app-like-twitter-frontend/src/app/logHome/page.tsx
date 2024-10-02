"use client";

import "../globals.css";
import Header from "@/components/Header";
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
import Posts from "../../components/posts";

export default function PostsWall() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(true);
  const justFalse = false;

  const [posts, setPosts] = useState<any[]>([]);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isCreatedPostWinPopup, setCreatePostWinPopup] = useState(false);
  const currentUserNickname = Cookies.get("Nick");
  const [searchWindow, setSearchWindow] = useState({ text: "" });
  const [likedByPopupPostId, setLikedByPopupPostId] = useState<number | null>(
    null
  );
  const [isSearching, setIsSearching] = useState(false);

  const togglePopupLikedBy = (postId: number | null) => {
    setLikedByPopupPostId(postId);
  };
  const togglePopupCreate = () => {
    setCreatePostWinPopup(!isCreatedPostWinPopup);
  };

  const handleSearchClick = () => {
    setIsVisible(!isVisible);
    setIsSearching(!isSearching);
  };
  const handleCancalClik = () => {
    setIsSearching(!isSearching);
    setPostByTag([]);
  };

  const getPosts = async (
    url: string = "http://127.0.0.1:8000/p_w/show_user_posts/"
  ) => {
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `JWT ${Cookies.get("access")}`,
        },
      });

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
        `http://127.0.0.1:8000/p_w/show_user_posts/${post_id}/comments/`,
        {
          headers: {
            Authorization: `JWT  ${Cookies.get("access")}`,
          },
        }
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

  const moveToUserProfile = async (nickname: string) => {
    router.push(`/userProfile/${nickname}`);
  };
  const handleRedirectCLik = (postId: number) => {
    router.push(`/post/${postId}`);
  };

  console.log(searchWindow.text);

  const [postByTag, setPostByTag] = useState<any[]>([]);
  const [nextPagePostBytag, setNextPagePostBytag] = useState<string | null>(
    null
  );
  const [hasMorePostBytag, setHasMorePostBytag] = useState<boolean>(true);
  const searchPosByTagOrUser = async (url?: string) => {
    const isUser = !searchWindow.text.startsWith("#");

    const constructedUrl =
      url ||
      (isUser
        ? `http://127.0.0.1:8000/u/search-user-profile/?user_name=${searchWindow.text}`
        : `http://127.0.0.1:8000/p_w/search-post-by-tags/?tag_name=${encodeURIComponent(searchWindow.text.toUpperCase())}`);
    try {
      const response = await axios.get(constructedUrl, {
        headers: {
          Authorization: `JWT ${Cookies.get("access")}`,
        },
      });

      if (isUser) {
        moveToUserProfile(response.data.nickname);
      } else {
        setPostByTag((prevPosts) => {
          const existingPostIds = new Set(
            prevPosts.map((post) => post.post_id)
          );
          const newUniquePosts = response.data.results.filter(
            (post: any) => !existingPostIds.has(post.post_id)
          );

          return [...prevPosts, ...newUniquePosts];
        });

        setNextPagePostBytag(response.data.next);

        if (!response.data.next) {
          setHasMorePostBytag(false);
        }
        setIsVisible(true);
      }
    } catch (error: any) {
      console.error(error);
      setHasMorePostBytag(false);
    }
  };
  const fetchMorePostsByTag = () => {
    if (nextPagePostBytag) {
      searchPosByTagOrUser(nextPagePostBytag);
    }
  };

  console.log("postByTag", postByTag);

  return (
    <div>
      <Toaster />
      <Header RegisterShouldPopup={justFalse} />
      <div className="flex flex-col sm:flex-row ">
        <div className="w-full sm:w-4/5 flex h-screen border-x-4 border-lighterDark">
          <div className="w-4/5 mx-auto flex justify-center mt-5 sm:mt-5">
            <div
              id="scrollableDiv"
              className="flex-1 overflow-y-auto scrollbar-hide sm:w-[60%] sm:mx-auto"
              style={{ height: "90vh" }}
            >
              <Posts
                posts={isSearching ? postByTag : posts}
                fetchMorePosts={
                  isSearching ? fetchMorePostsByTag : fetchMorePosts
                }
                hasMore={isSearching ? hasMorePostBytag : hasMore}
                isSearch={isSearching}
                currentUserNickname={`${currentUserNickname}`}
                commentsByPost={commentsByPost}
                setPosts={isSearching ? setPostByTag : setPosts}
                moveToUserProfile={moveToUserProfile}
                handleRedirectClick={handleRedirectCLik}
                likedByPopupPostId={likedByPopupPostId}
                togglePopupLikedBy={togglePopupLikedBy}
              />
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
                onChange={(e) =>
                  setSearchWindow({
                    ...searchWindow,
                    text: e.target.value,
                  })
                }
              />
              <svg
                className="w-6 h-6 absolute left-2 top-2 text-gray-400 cursor-pointer"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                onClick={() => {
                  handleSearchClick(), searchPosByTagOrUser();
                  if (isSearching) {
                    handleCancalClik();
                  }
                }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>

              {isSearching && (
                <button
                  onClick={handleCancalClik}
                  className="text-gray-300 bg-lighterDark hover:bg-gray-800 px-4 py-2 rounded-lg shadow m-3"
                >
                  Cacael
                </button>
              )}
            </div>

            <button
              onClick={togglePopupCreate}
              className="text-gray-300 bg-lighterDark hover:bg-gray-800 px-4 py-2 rounded-lg shadow"
            >
              Add post
            </button>
            {isCreatedPostWinPopup && (
              <AddPost
                togglePopup={togglePopupCreate}
                setCreatePostWinPopup={setCreatePostWinPopup}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
