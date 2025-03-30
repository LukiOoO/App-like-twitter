"use client";

import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { AnimatePresence, motion } from "framer-motion";
import Post from "@/components/post/Post";
import { PostListProps } from "@/types/porps/props";

const PostList: React.FC<PostListProps> = ({
  posts,
  fetchMorePosts,
  hasMore,
  extraPostClasses,
  currentUserNickname,
  commentsByPost,
  onPostClick,
  onUsernameClick,
  onLikeClick,
  onCommentClick,
  onLikedByClick,
  animationProps,
  likedByPopupPostId,
  imageClass,
  gifClass,
  videoClass,
}) => {
  return (
    <InfiniteScroll
      dataLength={posts.length}
      next={fetchMorePosts}
      hasMore={hasMore}
      loader={<h4 className="text-center text-gray-400">Loading...</h4>}
      endMessage={
        <p className="text-center text-gray-400">
          {!hasMore && <b>No more posts to display</b>}
        </p>
      }
      scrollableTarget="scrollableDiv"
    >
      {posts.length > 0 ? (
        <AnimatePresence>
          <div className="space-y-6">
            {posts
              .slice()
              .reverse()
              .map((postObj) => (
                <motion.div key={postObj.post_id} {...(animationProps || {})}>
                  <Post
                    videoClass={videoClass}
                    gifClass={gifClass}
                    imageClass={imageClass}
                    extraPostClasses={extraPostClasses}
                    postObj={postObj}
                    currentUserNickname={currentUserNickname}
                    commentsByPost={commentsByPost}
                    onPostClick={onPostClick}
                    onUsernameClick={onUsernameClick}
                    onLikeClick={onLikeClick}
                    onCommentClick={onCommentClick}
                    onLikedByClick={onLikedByClick}
                    likedByPopupPostId={likedByPopupPostId}
                  />
                </motion.div>
              ))}
          </div>
        </AnimatePresence>
      ) : (
        <div className="p-6 text-center sm:w-full sm:h-full">
          <p className="font-semibold text-gray-500">No matches found</p>
        </div>
      )}
    </InfiniteScroll>
  );
};

export default PostList;
