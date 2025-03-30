import React from "react";
import PostList from "@/components/post_posts/PostList";
import { PostsSectionProps } from "@/types/porps/props";

const PostsSection: React.FC<PostsSectionProps> = ({
  posts,
  fetchMorePosts,
  hasMore,
  currentUserNickname,
  commentsByPost,
  onUsernameClick,
  onLikeClick,
  onCommentClick,
  onPostClick,
  onLikedByClick,
  likedByPopupPostId,
  animationProps,
  imageClass,
  gifClass,
  videoClass,
}) => {
  return (
    <div className="h-2/6 sm:h-1/2 text-center border-lighterDark border-b-4 p-4">
      <span className="text-2xl font-bold text-slate-600 block mb-1 animate-pulse">
        Your posts:
      </span>
      <div className="h-[95%] overflow-y-scroll scrollbar-hide space-y-6">
        <PostList
          posts={posts}
          fetchMorePosts={fetchMorePosts}
          hasMore={hasMore}
          currentUserNickname={currentUserNickname}
          commentsByPost={commentsByPost}
          onUsernameClick={onUsernameClick}
          onLikeClick={onLikeClick}
          onCommentClick={onCommentClick}
          onPostClick={onPostClick}
          onLikedByClick={onLikedByClick}
          likedByPopupPostId={likedByPopupPostId}
          animationProps={animationProps}
          imageClass={imageClass}
          gifClass={gifClass}
          videoClass={videoClass}
          extraPostClasses="hover:scale-105 transition-all duration-300 ease-out"
        />
      </div>
    </div>
  );
};

export default PostsSection;
