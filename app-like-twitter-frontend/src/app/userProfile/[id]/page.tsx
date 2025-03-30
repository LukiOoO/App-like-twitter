"use client";

import "../../globals.css";
import Header from "@/components/header/Header";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import jwt from "jsonwebtoken";
import UserData from "@/components/user_profile/UserData";
import UserComments from "@/components/user_profile/UserComments";
import UserPosts from "@/components/user_profile/UserPosts";

export default function UserProfile() {
  const router = useRouter();
  const [posts, setPosts] = useState<any[]>([]);
  const [userComments, setUserComments] = useState<any[]>([]);
  const [userData, setUserData] = useState({
    avatar: "",
    nickname: "",
    email: "",
    followersCount: 0,
    followers: [] as number[],
    following: [] as number[],
    followingCount: 0,
    id: 0,
    freeze_or_not: false,
    last_login: "",
  });
  const [isFrozenAccount, setIsFrozenAccount] = useState(false);
  const [canUserFollowOrNot, setCanUserFollowOrNot] = useState(false);
  const [isAuthor, setIsAuthor] = useState(false);

  const pathname = usePathname();
  const nickname = pathname.split("/")[2];

  const getUserData = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/u/search-user-profile/?user_name=${nickname}`,
        {
          headers: { Authorization: `JWT ${Cookies.get("access")}` },
        }
      );
      const filteredFollowers = response.data.user_followers.filter(
        (followerId: number) => followerId !== response.data.id
      );
      setUserData({
        id: response.data.id,
        avatar: response.data.avatar,
        nickname: response.data.nickname,
        email: response.data.email,
        freeze_or_not: response.data.freeze_or_not,
        followersCount: filteredFollowers.length || 0,
        followingCount: response.data.following.length || 0,
        followers: response.data.user_followers,
        following: response.data.following,
        last_login: response.data.last_login,
      });
      setIsFrozenAccount(response.data.freeze_or_not);
    } catch (error: any) {
      console.log(error);
    }
  };

  const getUserPosts = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/u/search-user-posts/?user_name=${nickname}`,
        {
          headers: { Authorization: `JWT ${Cookies.get("access")}` },
        }
      );
      setPosts(response.data);
    } catch (error: any) {
      console.log(error);
    }
  };

  const getUserComments = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/c/show-user-comments/?user_nickname=${nickname}`,
        {
          headers: { Authorization: `JWT ${Cookies.get("access")}` },
        }
      );
      setUserComments(response.data["User comments"]);
    } catch (error: any) {
      console.log(error);
    }
  };

  const followUnFollowUser = async () => {
    try {
      const endpoint = canUserFollowOrNot
        ? "http://127.0.0.1:8000/u/you-can-follow/"
        : "http://127.0.0.1:8000/u/you-can-unfollow/";
      await axios.post(
        endpoint,
        canUserFollowOrNot
          ? { follow_user: userData.id }
          : { unfollow_user: userData.id },
        { headers: { Authorization: `JWT ${Cookies.get("access")}` } }
      );
      await getUserData();
    } catch (error: any) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserPosts();
    getUserComments();
    getUserData();
  }, []);

  useEffect(() => {
    const token = Cookies.get("access") || "";
    const decodedToken = jwt.decode(token);
    if (decodedToken && typeof decodedToken === "object") {
      const userId: number = decodedToken["user_id"];
      setCanUserFollowOrNot(!userData.followers.includes(userId));
      setIsAuthor(userData.id === userId);
    }
  }, [userData]);

  const handleRedirectClick = (postId?: number): void => {
    router.push(`/post/${postId}`);
  };

  return (
    <div>
      <Header registerShouldPopup={false} />
      <div className="flex sm:flex-row flex-col h-screen w-screen">
        <div className="w-full sm:w-2/5 flex flex-col">
          <UserData
            userData={userData}
            isFrozenAccount={isFrozenAccount}
            isAuthor={isAuthor}
            canUserFollowOrNot={canUserFollowOrNot}
            onFollowToggle={followUnFollowUser}
          />

          <UserComments
            userComments={userComments}
            onRedirectClick={handleRedirectClick}
          />
        </div>
        <div className="w-full sm:w-3/5 flex flex-col mt-4 sm:mt-0 sm:h-screen h-4/5">
          <UserPosts posts={posts} onPostClick={handleRedirectClick} />
        </div>
      </div>
    </div>
  );
}
