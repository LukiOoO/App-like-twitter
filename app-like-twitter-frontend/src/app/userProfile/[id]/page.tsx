"use client";

import "../../globals.css";
import Header from "@/components/header/Header";
import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";
import UserData from "@/components/user_profile/UserData";
import UserComments from "@/components/user_profile/UserComments";
import UserPosts from "@/components/user_profile/UserPosts";
import {
  getUserDataAPI,
  getUserPostsAPI,
  getUserCommentsAPI,
  followUnFollowUserAPI,
} from "@/utils/api";

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

  const fetchUserData = async () => {
    try {
      const data = await getUserDataAPI(nickname);
      const filteredFollowers = data.user_followers.filter(
        (followerId: number) => followerId !== data.id
      );
      setUserData({
        id: data.id,
        avatar: data.avatar,
        nickname: data.nickname,
        email: data.email,
        freeze_or_not: data.freeze_or_not,
        followersCount: filteredFollowers.length || 0,
        followingCount: data.following.length || 0,
        followers: data.user_followers,
        following: data.following,
        last_login: data.last_login,
      });
      setIsFrozenAccount(data.freeze_or_not);
    } catch (error: any) {}
  };

  const fetchUserPosts = async () => {
    try {
      const postsData = await getUserPostsAPI(nickname);
      setPosts(postsData);
    } catch (error: any) {}
  };

  const fetchUserComments = async () => {
    try {
      const commentsData = await getUserCommentsAPI(nickname);
      setUserComments(commentsData["User comments"]);
    } catch (error: any) {}
  };

  const handleFollowToggle = async () => {
    try {
      await followUnFollowUserAPI(userData.id, canUserFollowOrNot);
      await fetchUserData();
    } catch (error: any) {}
  };

  useEffect(() => {
    fetchUserPosts();
    fetchUserComments();
    fetchUserData();
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
            onFollowToggle={handleFollowToggle}
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
