"use client";

import { useCallback } from "react";
import { usePostActionsProps } from "@/types/porps/props";

export const usePostActions = ({
  postId,
  currentUserNickname,
  isAuthenticated,
  onPostClick,
  onUsernameClick,
  onLikeClick,
  onCommentClick,
  onLikedByClick,
}: usePostActionsProps) => {
  const handlePostClick = useCallback(
    (id?: number) => {
      const usedPostId = id ?? postId;
      if (isAuthenticated && usedPostId !== undefined) {
        onPostClick(usedPostId);
      }
    },
    [isAuthenticated, postId]
  );

  const handleUsernameClick = useCallback(
    (currentUserNickname?: string) => {
      const usedcurrentUserNickname =
        currentUserNickname ?? currentUserNickname;
      if (isAuthenticated && currentUserNickname !== undefined) {
        onUsernameClick(usedcurrentUserNickname);
      } else {
        onUsernameClick();
      }
    },
    [isAuthenticated, currentUserNickname]
  );

  const handleLikeClick = useCallback(
    (id?: number) => {
      const usedPostId = id ?? postId;
      if (isAuthenticated && usedPostId !== undefined) {
        onLikeClick(usedPostId);
      } else {
        onLikeClick();
      }
    },
    [isAuthenticated, postId]
  );

  const handleCommentClick = useCallback(
    (id?: number) => {
      const usedPostId = id ?? postId;
      if (isAuthenticated && usedPostId !== undefined) {
        onCommentClick(usedPostId);
      } else {
        onCommentClick();
      }
    },
    [isAuthenticated, postId]
  );

  const handleLikedByClick = useCallback(
    (id?: number) => {
      const usedPostId = id ?? postId;
      if (isAuthenticated && usedPostId !== undefined) {
        onLikedByClick(usedPostId);
      } else {
        onLikedByClick();
      }
    },
    [isAuthenticated, postId]
  );

  return {
    handlePostClick,
    handleUsernameClick,
    handleLikeClick,
    handleCommentClick,
    handleLikedByClick,
  };
};
