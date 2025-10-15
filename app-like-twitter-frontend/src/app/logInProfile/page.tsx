"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import Cookies from "js-cookie";

import "../globals.css";

import Header from "@/components/header/Header";
import UserInfo from "@/components/profile/UserInfo";
import PostsSection from "@/components/profile/PostSection";
import SocialSections from "@/components/profile/SocialSections";
import CommentsSection from "@/components/profile/CommentSection";

import { handleRedirectClick, moveToUserProfile } from "@/utils/redirects";
import { emptyFunction } from "@/utils/emptyFunction";

import {
  getUserDataApi,
  updateUserDataApi,
  getFollowersApi,
  getFollowingApi,
  getUserTagsApi,
  getUserPostsApi,
  getUserCommentsApi,
  sendResetPasswordEmailApi,
  updateUserAvatarApi,
  searchUserEmailApi,
  resendActivationApi,
  updateFreezeStatusApi,
} from "@/utils/api";

export default function ProfilePage() {
  const router = useRouter();

  const [userData, setUserData] = useState({
    nickname: "",
    email: "",
    avatar: "",
    freeze_or_not: false,
  });
  const [error, setError] = useState(false);
  const [isEditedNick, setIsEditedNick] = useState(false);
  const [isEditedEmail, setIsEditedEmail] = useState(false);
  const [isFrozenAccount, setIsFrozenAccount] = useState(false);
  const [email, setEmail] = useState("");

  const [posts, setPosts] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [followers, setFollowers] = useState<any[]>([]);
  const [following, setFollowing] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);

  const [isEditingComment, setIsEditingComment] = useState<{
    editComment: boolean;
    comment_id: number | null;
  }>({ editComment: false, comment_id: null });

  const [searchTerm, setSearchTerm] = useState("");
  const [searchTermTag, setSearchTermTag] = useState("");
  const [searchTermFollowers, setSearchTermFollowers] = useState("");

  const [avatar, setAvatar] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handlePencilClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;
    setAvatar(selectedFile);

    const formData = new FormData();
    formData.append("avatar", selectedFile);

    try {
      await updateUserAvatarApi(formData);
      toast.success("Avatar uploaded successfully!");
      await fetchUserData();
    } catch (error: any) {
      console.error("Failed to upload avatar:", error);
      toast.error("Failed to upload avatar.");
    }
  };

  const fetchUserData = async () => {
    try {
      const data = await getUserDataApi();
      setUserData({
        avatar: data.avatar,
        nickname: data.nickname,
        email: data.email,
        freeze_or_not: data.freeze_or_not,
      });
    } catch (error: any) {
      console.error(error.response?.data);
      if (error.response && error.response.status === 403) {
        const responseData = error.response.data;
        const freezeMessage = Object.keys(responseData)[0];
        if (freezeMessage === "Your account is frozen") {
          setIsFrozenAccount(true);
          setEmail(responseData["Your account is frozen"]);
        }
      } else {
        setError(true);
      }
    }
  };

  const changeUserData = async () => {
    try {
      await updateUserDataApi(userData);
      toast.success("The data has been changed");
      await fetchUserData();
    } catch (error: any) {
      if (error.response?.data) {
        const errorString = JSON.stringify(error.response);
        toast.error(`${errorString.split("string='")[1].split(".")[0]}`);
        await fetchUserData();
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  const sendResetPasswordEmail = async () => {
    try {
      await sendResetPasswordEmailApi(userData.email);
      toast.success("Password reset email has been sent");
    } catch (error: any) {
      toast.error("Something went wrong");
    }
  };

  const fetchFollowers = async () => {
    try {
      const data = await getFollowersApi();
      setFollowers(data);
    } catch (error: any) {}
  };

  const fetchFollowing = async () => {
    try {
      const data = await getFollowingApi();
      setFollowing(data);
    } catch (error: any) {}
  };

  const fetchTags = async () => {
    try {
      const data = await getUserTagsApi();
      setTags(data);
    } catch (error: any) {}
  };

  const fetchPosts = async () => {
    try {
      if (userData.nickname) {
        const data = await getUserPostsApi(userData.nickname);
        setPosts(data);
      }
    } catch (error: any) {}
  };

  const fetchUserComments = async () => {
    try {
      const data = await getUserCommentsApi();
      setComments(data);
    } catch (error: any) {}
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (userData.nickname) {
      fetchPosts();
    }
  }, [userData.nickname]);

  useEffect(() => {
    fetchUserComments();
    fetchFollowers();
    fetchFollowing();
    fetchTags();
  }, []);

  const onPostClick = (postId?: number): void => {
    handleRedirectClick(router, postId);
  };

  const onUsernameClick = (nickname?: string): void => {
    moveToUserProfile(router, nickname);
  };
  const freezeAccount = async () => {
    try {
      await updateFreezeStatusApi(true);
      toast.success("Konto zostało zamrożone");
      await fetchUserData();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const unFreezeAccount = async () => {
    try {
      const userEmail = await searchUserEmailApi(userData.nickname);
      await resendActivationApi(userEmail);
      toast.success("Link aktywacyjny został wysłany na Twój e-mail");
      await updateFreezeStatusApi(false);
      await fetchUserData();
    } catch (err: any) {
      toast.error(err.message);
    }
  };
  return (
    <div className="min-h-screen bg-black text-white">
      <Header registerShouldPopup={false} />
      <Toaster />
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-gray-900  p-4 rounded">
              <UserInfo
                userData={userData}
                setUserData={setUserData}
                isFrozenAccount={isFrozenAccount}
                isEditedNick={isEditedNick}
                isEditedEmail={isEditedEmail}
                setIsEditedNick={setIsEditedNick}
                setIsEditedEmail={setIsEditedEmail}
                handlePencilClick={handlePencilClick}
                fileInputRef={fileInputRef}
                handleFileChange={handleFileChange}
                changeUserData={changeUserData}
                sendResetPasswordEmail={sendResetPasswordEmail}
                freezeAccount={freezeAccount}
                unFreezeAccount={unFreezeAccount}
                email={email}
              />
            </div>

            <div className="bg-gray-900  p-4 rounded">
              <SocialSections
                followers={followers}
                following={following}
                tags={tags}
                searchTermFollowers={searchTermFollowers}
                handleSearchFollowers={(e) =>
                  setSearchTermFollowers(e.target.value)
                }
                searchTerm={searchTerm}
                handleSearch={(e) => setSearchTerm(e.target.value)}
                searchTermTag={searchTermTag}
                handleSearchTag={(e) => setSearchTermTag(e.target.value)}
                removeFollowing={emptyFunction}
                removeTag={emptyFunction}
                currentUserNickname={Cookies.get("Nick") || ""}
              />
            </div>
          </div>

          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-4/5 bg-gray-900  p-4 rounded">
              <PostsSection
                posts={posts}
                fetchMorePosts={() => {}}
                hasMore={false}
                currentUserNickname={userData.nickname}
                commentsByPost={{}}
                onUsernameClick={onUsernameClick}
                onLikeClick={onPostClick}
                onCommentClick={onPostClick}
                onPostClick={onPostClick}
                onLikedByClick={onPostClick}
                likedByPopupPostId={null}
                animationProps={{}}
                imageClass="image-item"
                gifClass="gif-item"
                videoClass="video-item"
              />
            </div>

            <div className="h-4/5 bg-gray-900  p-4 rounded">
              <CommentsSection
                comments={comments}
                onPostClick={onPostClick}
                setIsEditingComment={setIsEditingComment}
                isEditingComment={isEditingComment}
                togglePopupEditCom={() =>
                  setIsEditingComment({ editComment: false, comment_id: null })
                }
                handleRedirectCLik={onPostClick}
                getUserComments={emptyFunction}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
