"use client";

import React, { useState, useEffect, useRef } from "react";
import "../globals.css";
import axios from "axios";
import Header from "@/components/header/Header";
import { toast, Toaster } from "react-hot-toast";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

import UserInfo from "@/components/profile/UserInfo";
import PostsSection from "@/components/profile/PostSection";
import SocialSections from "@/components/profile/SocialSections";
import CommentsSection from "@/components/profile/CommentSection";

export default function ProfilePage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const [isEditedNick, setIsEditedNick] = useState(false);
  const [isEditedEmail, setIsEditedEmail] = useState(false);
  const [isFrozenAccount, setIsFrozenAccount] = useState(false);
  const [isEditingComment, setIsEditingComment] = useState<{
    editComment: boolean;
    comment_id: number | null;
  }>({ editComment: false, comment_id: null });
  const [userData, setUserData] = useState({
    nickname: "",
    email: "",
    avatar: "",
    freeze_or_not: false,
  });

  const togglePopupEditCom = () => {
    setIsEditingComment({ editComment: false, comment_id: null });
  };

  const handleRedirectCLik = (postId?: number): void => {
    router.push(`/post/${postId}`);
  };

  const moveToUserProfile = (nickname?: string): void => {
    router.push(`/userProfile/${nickname}`);
  };

  const freezeAccount = async (freeze_or_not: boolean) => {
    try {
      await axios.put(
        "http://127.0.0.1:8000/u/users/me/",
        {
          nickname: userData.nickname,
          email: userData.email,
          avatar: userData.avatar,
          freeze_or_not: freeze_or_not,
        },
        { headers: { Authorization: "JWT " + Cookies.get("access") } }
      );
    } catch (error: any) {
      console.log(error);
    }
  };

  const unFreezeAccount = async () => {
    try {
      await axios.post(
        "http://127.0.0.1:8000/u/users/resend_activation/",
        { email: email },
        { headers: { Authorization: "JWT " + Cookies.get("access") } }
      );
      toast.success("The account unfreezing email has been sent");
    } catch (error: any) {
      console.log(error);
    }
  };

  const changeUserData = async () => {
    try {
      await axios.put(
        "http://127.0.0.1:8000/u/users/me/",
        {
          nickname: userData.nickname,
          email: userData.email,
          avatar: userData.avatar,
          freeze_or_not: userData.freeze_or_not,
        },
        { headers: { Authorization: "JWT " + Cookies.get("access") } }
      );
      toast.success("The data has been changed");
      await getUserData();
    } catch (error: any) {
      if (error.response.data) {
        const errorString = JSON.stringify(error.response);
        toast.error(`${errorString.split("string='")[1].split(".")[0]}`);
        await getUserData();
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  const sendResetPasswordEmail = async () => {
    try {
      await axios.post("http://127.0.0.1:8000/u/users/reset_password/", {
        email: userData.email,
      });
      toast.success("Password reset email has been sent");
    } catch (error: any) {
      toast.error("Something went wrong");
    }
  };

  const getUserData = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/u/users/me/", {
        headers: { Authorization: "JWT " + Cookies.get("access") },
      });
      setUserData({
        avatar: response.data.avatar,
        nickname: response.data.nickname,
        email: response.data.email,
        freeze_or_not: response.data.freeze_or_not,
      });
    } catch (error: any) {
      console.log(error.response.data);
      if (error.response && error.response.status === 403) {
        const responseData = error.response.data;
        const freezeMessage = Object.keys(responseData)[0];
        if (freezeMessage === "Your account is frozen") {
          setIsFrozenAccount(true);
          setEmail(responseData["Your account is frozen"]);
        }
      } else {
        setError(true);
        console.log(error.message);
      }
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  const [avatar, setAvatar] = useState(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handlePencilClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = async (event: any) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;
    setAvatar(selectedFile);

    const formData = new FormData();
    formData.append("avatar", selectedFile);

    try {
      const response = await axios.put(
        "http://127.0.0.1:8000/u/user-avatar-update/",
        formData,
        {
          headers: {
            Authorization: `JWT ${Cookies.get("access")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        toast.success("Avatar uploaded successfully!");
        await getUserData();
      }
    } catch (error: any) {
      console.error("Failed to upload avatar:", error);
      toast.error("Failed to upload avatar.");
    }
  };

  const [followsers, setFollowers] = useState<any[]>([]);
  const [following, setFollowing] = useState<any[]>([]);
  const getFollower = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/u/your-followers/",
        {
          headers: { Authorization: `JWT ${Cookies.get("access")}` },
        }
      );
      setFollowers(response.data["Your followers"]);
    } catch (error: any) {
      console.log(error);
    }
  };

  const removeF = async (id: number) => {
    try {
      await axios.post(
        "http://127.0.0.1:8000/u/you-can-unfollow/",
        { unfollow_user: id },
        { headers: { Authorization: `JWT ${Cookies.get("access")}` } }
      );
      await getFollowing();
    } catch (error: any) {
      console.log(error);
    }
  };

  const getFollowing = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/u/you-are-following/",
        {
          headers: { Authorization: `JWT ${Cookies.get("access")}` },
        }
      );
      setFollowing(response.data["You are following"]);
    } catch (error: any) {
      console.log(error);
    }
  };

  const [searchTerm, setSearchTerm] = useState("");
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const [tags, setTags] = useState<any[]>([]);
  const getTags = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/t/user-tags-list/",
        {
          headers: { Authorization: `JWT ${Cookies.get("access")}` },
        }
      );
      setTags(response.data["Your tags"]);
    } catch (error: any) {
      console.log(error);
    }
  };

  const [searchTermTag, setSearchTermTag] = useState("");
  const handleSearchTag = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTermTag(e.target.value);
  };

  const removeT = async (id: number) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/t/user-tags-list/${id}/`, {
        headers: { Authorization: `JWT ${Cookies.get("access")}` },
      });
      await getTags();
    } catch (error: any) {
      console.log(error);
    }
  };

  const [searchTermFollowers, setSearchTermFollowers] = useState("");
  const handleSearchFollowers = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTermFollowers(e.target.value);
  };

  const [posts, setPosts] = useState<any[]>([]);
  const getPost = async (nickname: string) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/u/search-user-posts/?user_name=${nickname}`,
        { headers: { Authorization: `JWT ${Cookies.get("access")}` } }
      );
      setPosts(response.data);
    } catch (error: any) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (userData.nickname) getPost(userData.nickname);
  }, [userData.nickname]);

  const [comments, setComments] = useState<any[]>([]);
  const getUserComments = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/u/all-user-comments/",
        {
          headers: { Authorization: `JWT ${Cookies.get("access")}` },
        }
      );
      setComments(response.data["Your comments"]);
    } catch (error: any) {
      console.log(error);
    }
  };

  const emptyFunction = () => ({ [1]: [] });

  useEffect(() => {
    getUserComments();
    getFollower();
    getFollowing();
    getTags();
  }, []);

  return (
    <div>
      <Toaster />
      <Header registerShouldPopup={false} />
      <div className="flex flex-col sm:flex-row h-screen w-full border-lighterDark border-x-4">
        <div className="w-full sm:w-2/5 h-auto sm:h-1/2">
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
          <SocialSections
            followers={followsers}
            following={following}
            tags={tags}
            searchTermFollowers={searchTermFollowers}
            handleSearchFollowers={handleSearchFollowers}
            searchTerm={searchTerm}
            handleSearch={handleSearch}
            searchTermTag={searchTermTag}
            handleSearchTag={handleSearchTag}
            removeFollowing={removeF}
            removeTag={removeT}
            currentUserNickname={Cookies.get("Nick") || ""}
          />
        </div>
        <div className="mt-72 sm:my-0 w-full sm:w-3/5 border-lighterDark border-l-4">
          <PostsSection
            posts={posts}
            fetchMorePosts={() => {}}
            hasMore={false}
            currentUserNickname={userData.nickname}
            commentsByPost={{}}
            onUsernameClick={(nickname) =>
              router.push(`/userProfile/${nickname}`)
            }
            onLikeClick={handleRedirectCLik}
            onCommentClick={handleRedirectCLik}
            onPostClick={handleRedirectCLik}
            onLikedByClick={handleRedirectCLik}
            likedByPopupPostId={null}
            animationProps={{}}
            imageClass="image-item"
            gifClass="gif-item"
            videoClass="video-item"
          />
          <CommentsSection
            comments={comments}
            onPostClick={handleRedirectCLik}
            setIsEditingComment={setIsEditingComment}
            isEditingComment={isEditingComment}
            togglePopupEditCom={togglePopupEditCom}
            handleRedirectCLik={handleRedirectCLik}
            getUserComments={emptyFunction}
          />
        </div>
      </div>
    </div>
  );
}
