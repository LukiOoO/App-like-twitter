import React from "react";
import PostList from "@/components/post_posts/PostList";
import { emptyFunction } from "@/utils/emptyFunction";
import { UserPostsProps } from "@/types/porps/props";

const UserPosts: React.FC<UserPostsProps> = ({ posts, onPostClick }) => {
  return (
    <div>
      <span className="text-2xl font-bold text-slate-600 block mb-1 animate-pulse text-center">
        User Posts
      </span>
      <div>
        <PostList
          imageClass="image-item"
          gifClass="gif-item"
          videoClass="video-item"
          extraPostClasses="hover:scale-105 transition-all duration-300 ease-out"
          posts={posts}
          fetchMorePosts={() => {}}
          hasMore={false}
          commentsByPost={emptyFunction()}
          onUsernameClick={emptyFunction}
          onLikeClick={onPostClick}
          onCommentClick={onPostClick}
          onLikedByClick={onPostClick}
          onPostClick={onPostClick}
        />
      </div>
    </div>
  );
};

export default UserPosts;
