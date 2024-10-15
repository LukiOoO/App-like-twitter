import { StaticImageData } from "next/image";
import React, { ReactNode } from "react";
import { PostObj, CommentsByPost } from "../interfaces/interfaces";
import { HTMLMotionProps } from "framer-motion";

export type HeaderProps = {
  registerShouldPopup: boolean;
};

export type LoggedInMenuProps = {
  userNickname: string;
  pathname: string;
  logOutUser: () => void;
};

export type LoggedOutMenuProps = {
  togglePopupLogin: () => void;
  togglePopupRegister: () => void;
  showPopupLogin: boolean;
  showPopupRegister: boolean;
  setShowPopupLogin: React.Dispatch<React.SetStateAction<boolean>>;
  setShowPopupRegister: React.Dispatch<React.SetStateAction<boolean>>;
};

export type NavigationBarProps = {
  RegisterShouldPopup: boolean;
};

export type NavItemProps = {
  onClick: () => void;
  children: ReactNode;
  imageSrc: string | StaticImageData;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
  extraClasses?: string;
  buttonClassName?: string;
  showPopup?: boolean;
  PopupComponent?: React.FC<any>;
  popupProps?: any;

  [key: string]: any;
};

export type MediaProps = {
  image?: string;
  gif?: string;
  video?: string;
};

export type ButtonProps = {
  onClick: () => void;
  buttonClassName: string;
  children: ReactNode;
  imageSrc?: string | StaticImageData;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
  ariaLabel?: string;
  [key: string]: any;
};

export type PostHeaderProps = {
  user: string;
  tags: string[];
  createdAt: string;
  onUsernameClick: () => void;
};

export type PostBodyProps = {
  text: string;
  image?: string;
  gif?: string;
  video?: string;
};

export type PostFooterProps = {
  likesCount: number;
  commentsCount: number;
  onLikeClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onCommentClick: () => void;
  onLikedByClick: () => void;
  userHasLikedPost: boolean;
};

export type PostListProps = {
  posts: PostObj[];
  fetchMorePosts: () => void;
  hasMore: boolean;
  currentUserNickname?: string;
  extraPostClasses?: string;
  likedByPopupPostId?: number | null;
  commentsByPost: CommentsByPost;
  animationProps?: HTMLMotionProps<"div">;
  onPostClick: (postId?: number) => void;
  onUsernameClick: (username?: string) => void;
  onLikeClick: (postId?: number) => void;
  onCommentClick: (postId?: number) => void;
  onLikedByClick: (postId?: number) => void;
};

export type PostProps = {
  postObj: PostObj;
  currentUserNickname?: string;
  commentsByPost: CommentsByPost;
  extraPostClasses?: string;
  likedByPopupPostId?: number | null;
  onPostClick: (postId?: number) => void;
  onUsernameClick: (username?: string) => void;
  onLikeClick: (postId?: number) => void;
  onCommentClick: (postId?: number) => void;
  onLikedByClick: (postId?: number) => void;
};

export type usePostActionsProps = {
  postId?: number;
  currentUserNickname?: string;
  isAuthenticated: boolean;
  onPostClick: (postId?: number) => void;
  onUsernameClick: (username?: string) => void;
  onLikeClick: (postId?: number) => void;
  onCommentClick: (postId?: number) => void;
  onLikedByClick: (postId?: number) => void;
};
