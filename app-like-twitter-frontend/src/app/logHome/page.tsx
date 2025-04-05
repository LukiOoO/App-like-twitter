"use client";

import React, { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

import "../globals.css";

import Header from "@/components/header/Header";
import AddPost from "@/app/addPostWIndow/addPostWindow";
import PostList from "@/components/post_posts/PostList";
import Button from "@/components/common/Button";

import {
  getPostsApi,
  getPostCommentsApi,
  searchPostsOrUsersApi,
  likePostApi,
} from "@/utils/api";

import { handleRedirectClick, moveToUserProfile } from "@/utils/redirects";

export default function PostsWall() {
  const router = useRouter();
  const currentUserNickname = Cookies.get("Nick");

  const [posts, setPosts] = useState<any[]>([]);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isCreatedPostWinPopup, setCreatePostWinPopup] = useState(false);
  const [likedByPopupPostId, setLikedByPopupPostId] = useState<number | null>(
    null
  );

  const [isVisible, setIsVisible] = useState(true);
  const [searchWindow, setSearchWindow] = useState({ text: "" });
  const [isSearching, setIsSearching] = useState(false);
  const [postByTag, setPostByTag] = useState<any[]>([]);
  const [nextPagePostBytag, setNextPagePostBytag] = useState<string | null>(
    null
  );
  const [hasMorePostBytag, setHasMorePostBytag] = useState<boolean>(true);

  const [commentsByPost, setCommentsByPost] = useState<{
    [key: number]: any[];
  }>({});

  const fetchPosts = async (url?: string) => {
    try {
      const data = await getPostsApi(url);
      setPosts((prevPosts) => {
        const existingPostIds = new Set(prevPosts.map((post) => post.post_id));
        const newUniquePosts = (data.results || []).filter(
          (post: any) => !existingPostIds.has(post.post_id)
        );
        return [...prevPosts, ...newUniquePosts];
      });
      setNextPage(data.next);
      if (!data.next) setHasMore(false);
    } catch (error: any) {
      console.error("Error fetching posts:", error);
      setHasMore(false);
    }
  };

  useEffect(() => {
    const fetchComments = async () => {
      const commentsMap: { [key: number]: any[] } = {};
      await Promise.all(
        posts.map(async (postObj: any) => {
          const comments = await getPostCommentsApi(postObj.post_id);
          commentsMap[postObj.post_id] = comments;
        })
      );
      setCommentsByPost(commentsMap);
    };
    if (posts.length > 0) fetchComments();
  }, [posts]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchMorePosts = () => {
    if (nextPage) fetchPosts(nextPage);
  };

  const searchPosByTagOrUser = async (url?: string) => {
    try {
      const { isUser, data } = await searchPostsOrUsersApi(searchWindow.text);
      if (isUser) {
        moveToUserProfile(data.nickname);
      } else {
        setPostByTag((prevPosts) => {
          const existingPostIds = new Set(
            prevPosts.map((post) => post.post_id)
          );
          const newUniquePosts = data.results.filter(
            (post: any) => !existingPostIds.has(post.post_id)
          );
          return [...prevPosts, ...newUniquePosts];
        });
        setNextPagePostBytag(data.next);
        if (!data.next) setHasMorePostBytag(false);
        setIsVisible(true);
      }
    } catch (error: any) {
      console.error(error);
      setHasMorePostBytag(false);
    }
  };

  const fetchMorePostsByTag = () => {
    if (nextPagePostBytag) searchPosByTagOrUser(nextPagePostBytag);
  };

  const handleLike = async (post_id?: number) => {
    try {
      const response = await likePostApi(post_id!);
      const action = response.detail;
      const updatePosts = (postsList: any[]) =>
        postsList.map((post) => {
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
              likes: { liked_by: updatedLikedBy, count: updatedCount },
            };
          }
          return post;
        });
      setPosts((prev) => updatePosts(prev));
      setPostByTag((prev) => updatePosts(prev));
    } catch (error) {
      console.error("Error liking/unliking post:", error);
    }
  };

  const handleLikeForPostBytags = async (post_id?: number) => {
    await handleLike(post_id);
  };

  const handleSearchClick = () => {
    setIsVisible((prev) => !prev);
    setIsSearching((prev) => !prev);
  };

  const handleCancalClik = () => {
    setIsSearching(false);
    setPostByTag([]);
  };

  const animationProps = {
    initial: { opacity: 0, x: -100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 100 },
    transition: { duration: 0.5, ease: "easeInOut" },
  };

  return (
    <div>
      <Toaster />
      <Header registerShouldPopup={false} />
      <div className="flex flex-col sm:flex-row ">
        <div className="w-full sm:w-4/5 flex h-screen border-x-4 border-gray-900">
          <div className="w-4/5 mx-auto flex justify-center mt-5 sm:mt-5">
            <div
              id="scrollableDiv"
              className="flex-1 overflow-y-auto scrollbar-hide sm:w-[60%] sm:mx-auto"
              style={{ height: "90vh" }}
            >
              <PostList
                imageClass="image-item"
                gifClass="gif-item"
                videoClass="video-item"
                posts={isSearching ? postByTag : posts}
                fetchMorePosts={
                  isSearching ? fetchMorePostsByTag : fetchMorePosts
                }
                hasMore={isSearching ? hasMorePostBytag : hasMore}
                currentUserNickname={currentUserNickname}
                commentsByPost={commentsByPost}
                onUsernameClick={(nickname) =>
                  moveToUserProfile(router, nickname)
                }
                onCommentClick={(postId) => handleRedirectClick(router, postId)}
                onLikeClick={isSearching ? handleLikeForPostBytags : handleLike}
                onLikedByClick={(postId) =>
                  setLikedByPopupPostId(postId ?? null)
                }
                likedByPopupPostId={likedByPopupPostId}
                animationProps={animationProps}
                onPostClick={() => {}}
              />
            </div>
          </div>
        </div>
        <div className="w-full sm:w-1/5 h-screen text-center border-gray-900 border-r-4">
          <div className="p-4">
            <h2 className="font-semibold mb-2">Search:</h2>
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Type tag/user"
                className="w-full p-2 pl-10 bg-lighterDark text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                onChange={(e) =>
                  setSearchWindow({ ...searchWindow, text: e.target.value })
                }
              />
              <svg
                className="w-6 h-6 absolute left-2 top-2 text-gray-400 cursor-pointer"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                onClick={() => {
                  handleSearchClick();
                  searchPosByTagOrUser();
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
                <Button
                  onClick={handleCancalClik}
                  buttonClassName="text-gray-300 bg-lighterDark hover:bg-gray-800 px-4 py-2 rounded-lg shadow m-3"
                >
                  Cancel
                </Button>
              )}
            </div>

            <Button
              onClick={() => setCreatePostWinPopup((prev) => !prev)}
              buttonClassName="text-gray-300 bg-lighterDark hover:bg-gray-800 px-4 py-2 rounded-lg shadow"
            >
              Add post
            </Button>
            {isCreatedPostWinPopup && (
              <AddPost
                togglePopup={() => setCreatePostWinPopup((prev) => !prev)}
                setCreatePostWinPopup={setCreatePostWinPopup}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
