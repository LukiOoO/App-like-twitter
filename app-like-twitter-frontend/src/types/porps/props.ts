import { StaticImageData } from "next/image";
import React, { ReactNode, ChangeEvent } from "react";
import {
  PostObj,
  CommentsByPost,
  CommentInterface,
  CommentType,
} from "../interfaces/interfaces";
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
  imageClass: string;
  gifClass: string;
  videoClass: string;
};

export type ButtonProps = {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
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
  imageClass: string;
  gifClass: string;
  videoClass: string;
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
  imageClass: string;
  gifClass: string;
  videoClass: string;
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
  imageClass: string;
  gifClass: string;
  videoClass: string;
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

export type CommentBodyProps = {
  comment: CommentInterface;
};

export type CommentProps = {
  comment: CommentInterface;
  onUsernameClick: (nickname: string) => void;
};

export type CommentHeaderProps = {
  comment: CommentInterface;
  onUsernameClick: (nickname: string) => void;
};

export type CommentListProps = {
  comments: CommentInterface[];
  onUsernameClick: (nickname: string) => void;
};

export type UserDataProps = {
  userData: {
    avatar: string;
    nickname: string;
    email: string;
    followersCount: number;
    followingCount: number;
    last_login: string;
    id: number;
  };
  isFrozenAccount: boolean;
  isAuthor: boolean;
  canUserFollowOrNot: boolean;
  onFollowToggle: () => void;
};
export type UserCommentsProps = {
  userComments: any[];
  onRedirectClick: (postId?: number) => void;
};

export type UserPostsProps = {
  posts: any[];
  onPostClick: (postId?: number) => void;
};

export type PopupContainerProps = {
  children: React.ReactNode;
  togglePopup: (e: React.MouseEvent<HTMLElement>) => void;
};

export type FormInputProps = {
  type: string;
  id: string;
  name: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export type PopupProps = {
  togglePopup: (event: React.MouseEvent<HTMLElement>) => void;
};

export type PopupPropsRegister = {
  togglePopup: (event: React.MouseEvent<HTMLElement>) => void;
  setShowPopupLogin: React.Dispatch<React.SetStateAction<boolean>>;
  setShowPopupRegister: React.Dispatch<React.SetStateAction<boolean>>;
};

export type MediaUploadFieldProps = {
  label: string;
  fileUrl: string | null;
  onEdit: () => void;
  onRemove: () => void;
  inputAccept: string;
  inputRef: React.RefObject<HTMLInputElement>;
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

export type TagManagerProps = {
  selectedTags: string[];
  onRemoveTag: (tag: string) => void;
  onToggleCreateTag: () => void;
  onToggleFindTags: () => void;
};

export type PostEditFormProps = {
  post: PostObj;
  refreshPost: () => void;
  cancelEdit: () => void;
};

export type UserInfoProps = {
  userData: any;
  setUserData: React.Dispatch<React.SetStateAction<any>>;
  isFrozenAccount: boolean;
  isEditedNick: boolean;
  isEditedEmail: boolean;
  setIsEditedNick: (val: boolean) => void;
  setIsEditedEmail: (val: boolean) => void;
  handlePencilClick: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleFileChange: (e: any) => void;
  changeUserData: () => void;
  sendResetPasswordEmail: () => void;
  freezeAccount: (freeze: boolean) => void;
  unFreezeAccount: () => void;
  email: string;
};
export type SocialSectionsProps = {
  followers: any[];
  following: any[];
  tags: any[];
  searchTermFollowers: string;
  handleSearchFollowers: (e: React.ChangeEvent<HTMLInputElement>) => void;
  searchTerm: string;
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  searchTermTag: string;
  handleSearchTag: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeFollowing: (id: number) => void;
  removeTag: (id: number) => void;
  currentUserNickname: string;
};

export type PostsSectionProps = {
  posts: any[];
  fetchMorePosts: () => void;
  hasMore: boolean;
  currentUserNickname: string;
  commentsByPost: { [key: number]: any };
  onPostClick: (postId?: number) => void;
  onUsernameClick: (nickname?: string) => void;
  onLikeClick: (postId?: number) => void;
  onCommentClick: (postId?: number) => void;
  onLikedByClick: (postId?: number) => void;
  likedByPopupPostId: number | null;
  animationProps: any;
  imageClass: string;
  gifClass: string;
  videoClass: string;
};

export type CommentsSectionProps = {
  comments: any[];
  onPostClick: (postId?: number) => void;
  setIsEditingComment: React.Dispatch<
    React.SetStateAction<{ editComment: boolean; comment_id: number | null }>
  >;
  isEditingComment: { editComment: boolean; comment_id: number | null };
  togglePopupEditCom: () => void;
  handleRedirectCLik: (postId?: number) => void;
  getUserComments: () => void;
};

export type EditableFieldProps = {
  value: string;
  isEditing: boolean;
  onChange: (value: string) => void;
  onToggleEdit: () => void;
  inputType?: string;
  // mozna dodac  klasy CSS
};

export type LikedByProps = {
  togglePopup: (event: React.MouseEvent<HTMLElement>) => void;
  likeUsers: any[];
  postId: number;
};

export type FindTagProps = {
  togglePopup: (event: React.MouseEvent<HTMLElement>) => void;
  onTagClick: (tag: string) => void;
};

export type CreateTagProps = {
  togglePopup: (event: React.MouseEvent<HTMLElement>) => void;
  setShowCreatedTagPopup: React.Dispatch<React.SetStateAction<boolean>>;
  jusCreatedTag: (tag: string) => void;
};

export type EditCommentWindowProps = {
  commentObj: CommentType;
  togglePopup: (event: React.MouseEvent<HTMLElement>) => void;
  getUserComments: () => void;
  setIsEditingComment: React.Dispatch<
    React.SetStateAction<{
      editComment: boolean;
      comment_id: number | null;
    }>
  >;
};

export type AddPostProps = {
  togglePopup: (event: React.MouseEvent<HTMLElement>) => void;
  setCreatePostWinPopup: React.Dispatch<React.SetStateAction<boolean>>;
};

export type CreateCommentProps = {
  togglePopup: (event: React.MouseEvent<HTMLElement>) => void;
  setcreateComWinpopup: React.Dispatch<React.SetStateAction<boolean>>;
  postComments: () => void;
  id: string;
};
