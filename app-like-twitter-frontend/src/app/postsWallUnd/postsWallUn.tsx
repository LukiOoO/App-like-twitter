"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Toaster } from "react-hot-toast";

import "../globals.css";

import Header from "@/components/header/Header";
import PostList from "@/components/post_posts/PostList";

import { getPostsApiUn, getPostCommentsApiUn } from "@/utils/api";

export default function PostsWallUndfiend() {
  const [posts, setPosts] = useState<any[]>([]);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoadingPosts, setIsLoadingPosts] = useState<boolean>(false);
  const [commentsByPost, setCommentsByPost] = useState<{
    [key: number]: any[];
  }>({});
  const [shouldPopUp, setShouldPopUp] = useState(false);

  const sentinelRef = useRef<HTMLDivElement>(null);

  const toggleShouldPopUp = () => {
    setShouldPopUp((prev) => !prev);
  };

  const getPosts = useCallback(async (url?: string) => {
    try {
      setIsLoadingPosts(true);
      const data = await getPostsApiUn(url);
      setPosts((prevPosts) => {
        const existingPostIds = new Set(prevPosts.map((post) => post.post_id));
        const newUniquePosts = data.results
          ? data.results.filter(
              (post: any) => !existingPostIds.has(post.post_id)
            )
          : [];
        return [...prevPosts, ...newUniquePosts];
      });
      setNextPage(data.next);
      if (!data.next) {
        setHasMore(false);
      }
    } catch (error: any) {
      console.error("Error fetching posts:", error);
      setHasMore(false);
    } finally {
      setIsLoadingPosts(false);
    }
  }, []);

  const getPostComments = useCallback(
    async (post_id: number): Promise<any[]> => {
      return await getPostCommentsApiUn(post_id);
    },
    []
  );

  useEffect(() => {
    if (posts.length > 0) {
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
      fetchComments();
    }
  }, [posts, getPostComments]);

  useEffect(() => {
    getPosts();
  }, [getPosts]);

  const fetchMorePosts = useCallback(() => {
    if (nextPage && !isLoadingPosts) {
      getPosts(nextPage);
    }
  }, [nextPage, isLoadingPosts, getPosts]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !isLoadingPosts) {
        fetchMorePosts();
      }
    });
    observer.observe(sentinel);
    return () => {
      observer.disconnect();
    };
  }, [hasMore, isLoadingPosts, fetchMorePosts]);

  useEffect(() => {
    if (shouldPopUp) {
      setShouldPopUp(false);
    }
  }, [shouldPopUp]);

  return (
    <div>
      <Header registerShouldPopup={shouldPopUp} />
      <Toaster />
      <div className="flex flex-col sm:flex-row">
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
                posts={posts}
                fetchMorePosts={fetchMorePosts}
                hasMore={hasMore}
                commentsByPost={commentsByPost}
                onUsernameClick={toggleShouldPopUp}
                onLikeClick={toggleShouldPopUp}
                onCommentClick={toggleShouldPopUp}
                onLikedByClick={toggleShouldPopUp}
                onPostClick={() => {}}
              />
              <div ref={sentinelRef} className="h-4" />
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
