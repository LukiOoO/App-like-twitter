"use client";

import "../../globals.css";
import Header from "@/components/header/Header";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import LikedBy from "@/app/likedBy/likedByWindow";
import FindTags from "@/app/findTagsWindow/findTagsWindow";
import EmptyHear from "@/assets/Nofollows.png";
import FullHear from "@/assets/Follows.png";
import Image from "next/image";
import RemoveIc from "@/assets/remove.png";
import Pencil from "@/assets/pencil.png";
import CreateTag from "@/app/createTagWindow/createTagWindow";
import toast, { Toaster } from "react-hot-toast";
import CommIc from "@/assets/comment.png";
import CreateComment from "@/app/commentWindow/commentWindow";
import jwt from "jsonwebtoken";
import AnonymusImg from "@/assets/anonymous.png";

export default function UserProfile() {
  const router = useRouter();
  const [post, setPosts] = useState<any[]>([]);
  const [showLikedByPopup, setShowLikedByPopup] = useState(false);
  const [canUserFollowOrNot, setCanUserFollowOrNot] = useState(false);
  const [isAuthor, setIsAuthor] = useState(false);
  const [userLike, setUserLike] = useState(false);
  const [userComments, setUserComments] = useState<any[]>([]);
  const [postComments, setPostComments] = useState<any[]>([]);
  const [isFrozenAccount, setIsFrozenAccount] = useState(false);
  const [userData, setUserData] = useState<{
    avatar: string;
    nickname: string;
    email: string;
    followersCount: number;
    followers: number[];
    following: number[];
    followingCount: number;
    id: number;
    freeze_or_not: boolean;
    last_login: string;
  }>({
    avatar: "",
    nickname: "",
    email: "",
    followersCount: 0,
    followers: [],
    following: [],
    followingCount: 0,
    id: 0,
    freeze_or_not: false,
    last_login: "",
  });
  const pathname = usePathname();
  const path = pathname;
  const nickname = path.split("/")[2];
  console.log(nickname);

  const togglePopupLikedBy = () => {
    setShowLikedByPopup(!showLikedByPopup);
  };
  const getUserData = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/u/search-user-profile/?user_name=${nickname}`,
        {
          headers: {
            Authorization: `JWT  ${Cookies.get("access")}`,
          },
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
      if (response.data.freeze_or_not) {
        setIsFrozenAccount(true);
      } else {
        setIsFrozenAccount(false);
      }
      console.log(response.data);
    } catch (error: any) {
      console.log(error);
    }
  };

  const getUserPosts = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/u/search-user-posts/?user_name=${nickname}`,
        {
          headers: {
            Authorization: `JWT  ${Cookies.get("access")}`,
          },
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
          headers: {
            Authorization: `JWT  ${Cookies.get("access")}`,
          },
        }
      );
      setUserComments(response.data["User comments"]);
    } catch (error: any) {
      console.log(error);
    }
  };
  console.log("COMMENTS USERS", userComments);

  console.log("can follow or not ", canUserFollowOrNot);
  const followUnFollowUser = async () => {
    const response = await axios.post(
      canUserFollowOrNot
        ? "http://127.0.0.1:8000/u/you-can-follow/"
        : "http://127.0.0.1:8000/u/you-can-unfollow/",
      canUserFollowOrNot
        ? {
            follow_user: userData.id,
          }
        : {
            unfollow_user: userData.id,
          },
      {
        headers: {
          Authorization: `JWT  ${Cookies.get("access")}`,
        },
      }
    );
    await getUserData();
    console.log(response);
    try {
    } catch (error: any) {
      console.log(error);
    }
  };
  const getPostComments = async (post_id: number): Promise<any[]> => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/p_w/show_user_posts/${post_id}/comments/`,
        {
          headers: {
            Authorization: `JWT  ${Cookies.get("access")}`,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.log(error);
      return [];
    }
  };
  const [commentsByPost, setCommentsByPost] = useState<{
    [key: number]: any[];
  }>({});

  useEffect(() => {
    const fetchComments = async () => {
      const commentsMap: { [key: number]: any[] } = {};

      await Promise.all(
        post.map(async (postObj: any) => {
          const comments = await getPostComments(postObj.post_id);
          commentsMap[postObj.post_id] = comments;
        })
      );
      setCommentsByPost(commentsMap);
    };
    if (post.length > 0) {
      fetchComments();
    }
  }, [post]);
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
      console.log("can follow user ", canUserFollowOrNot);
      console.log("FOllowers", userData.followers);

      if (userData && userData.id) {
        if (userData.id === userId) {
          setIsAuthor(true);
        } else {
          setIsAuthor(false);
        }
      }
    }
  }, [userData, setIsAuthor, setCanUserFollowOrNot]);

  const handleRedirectCLik = (postId: number) => {
    router.push(`/post/${postId}`);
  };

  return (
    <div>
      <Header registerShouldPopup={false} />
      <div className="flex sm:flex-row flex-col h-screen w-screen">
        <div className="w-full sm:w-2/5 flex flex-col">
          <div className="flex-1 sm:h-2/3 ">
            <span className="text-2xl font-bold text-slate-600 block mb-1 animate-pulse text-center">
              User data
            </span>
            {!isFrozenAccount ? (
              <div className="p-6">
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 mb-4">
                    <Image
                      src={userData?.avatar || AnonymusImg}
                      width={96}
                      height={96}
                      alt="User Avatar"
                      className="rounded-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-medium text-slate-800">
                    {userData.nickname}
                  </h3>
                  <p className="text-gray-600">{userData.email}</p>
                </div>
                <div className="mt-6 flex justify-around text-center">
                  <div>
                    <p className="text-lg font-semibold text-slate-700">
                      {userData.followersCount}
                    </p>
                    <p className="text-gray-500">Followers</p>
                  </div>
                  <div>
                    {!isAuthor && (
                      <Image
                        src={canUserFollowOrNot ? EmptyHear : FullHear}
                        alt="follow user"
                        width={30}
                        height={30}
                        className="cursor-pointer"
                        onClick={followUnFollowUser}
                      />
                    )}
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-slate-700">
                      {userData.followingCount}
                    </p>
                    <p className="text-gray-500">Following</p>
                  </div>
                </div>
                <div>
                  <p className="text-lg font-semibold text-slate-700 text-center">
                    {userData.last_login}
                  </p>
                  <p className="text-gray-500 text-center">Last Login</p>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center sm:w-full sm:h-full">
                <p className="font-semibold text-gray-500">
                  User has a frozen account
                </p>
              </div>
            )}
          </div>

          <div className="flex-1 sm:h-2/3 mt-4 sm:mt-0  ">
            <span className="text-2xl font-bold text-slate-600 block mb-1 animate-pulse text-center">
              User Comments
            </span>
            <div className="flex-1 overflow-y-auto scrollbar-hide h-[85%] sm:h-[85%] sm:w-[90%] sm:mx-auto">
              {userComments.length > 0 ? (
                <div className="space-y-6">
                  {userComments
                    .slice()
                    .reverse()
                    .map((commentObj: any, index: number) => (
                      <div
                        onClick={() => handleRedirectCLik(commentObj.post_id)}
                        key={index}
                        className="bg-gradient-to-tl from-lighterDark to-gray-950 p-8 rounded-xl shadow-xl hover:shadow-2xl 
                    transform hover:scale-105 transition-all duration-300 ease-out"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-xs font-semibold hover:text-teal-600 cursor-pointer">
                            {commentObj.user_nickname}
                          </p>
                          <div className="text-gray-400 text-xs">
                            {new Date(
                              commentObj.created_at
                            ).toLocaleDateString()}
                            {new Date(
                              commentObj.created_at
                            ).toLocaleTimeString()}
                          </div>
                        </div>
                        <p className="text-sm mb-4">{commentObj.text}</p>
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                          {commentObj.image && (
                            <img
                              src={commentObj.image}
                              alt="Comment Image"
                              className="rounded-md shadow-lg object-cover w-24 h-24 sm:w-32 sm:h-32"
                            />
                          )}
                          {commentObj.gif && (
                            <img
                              src={commentObj.gif}
                              alt="Comment GIF"
                              className="rounded-md shadow-md object-cover w-24 h-24 sm:w-32 sm:h-32"
                            />
                          )}
                          {commentObj.video && (
                            <video
                              src={commentObj.video}
                              controls
                              className="rounded-md shadow-lg w-24 h-24 sm:w-32 sm:h-32"
                            />
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div>
                  <p className="text-center font-semibold text-gray-500">
                    No matches found
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="w-full sm:w-3/5 flex flex-col mt-4 sm:mt-0 sm:h-screen h-4/5">
          <span className="text-2xl font-bold text-slate-600 block mb-1 animate-pulse text-center">
            User Posts
          </span>
          <div className="flex-1 overflow-y-auto scrollbar-hide sm:w-[60%] sm:mx-auto">
            {post.length > 0 ? (
              <div className="space-y-6">
                {post.map((postObj: any, index: number) => (
                  <div key={index}>
                    <div
                      onClick={() => handleRedirectCLik(postObj.post_id)}
                      className="bg-gradient-to-r from-lighterDark to-gray-900 p-8 rounded-xl shadow-xl hover:shadow-2xl 
                      transform hover:scale-105 transition-all duration-300 ease-out"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <p className="font-semibold text-sm hover:text-teal-600 cursor-pointer">
                          {postObj.user}
                        </p>
                        <p className="text-xs text-teal-600">
                          {postObj.tags.join(" ")}
                        </p>
                        <div className="text-gray-400 text-xs">
                          {new Date(postObj.created_at).toLocaleDateString()}{" "}
                          {new Date(postObj.created_at).toLocaleTimeString()}
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-gray-200 text-sm break-all">
                          {postObj.text}
                        </p>
                      </div>
                      <div className="flex flex-col items-center gap-4 mb-4">
                        {postObj.image && (
                          <img
                            src={postObj.image}
                            alt="Post Image"
                            className="rounded-md shadow-lg object-cover w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48"
                          />
                        )}
                        {postObj.gif && (
                          <img
                            src={postObj.gif}
                            alt="Post GIF"
                            className="rounded-md shadow-md object-cover w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48"
                          />
                        )}
                        {postObj.video && (
                          <video
                            src={postObj.video}
                            controls
                            className="rounded-md shadow-lg w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48"
                          />
                        )}
                      </div>
                      <div className="flex justify-between items-center text-xs text-gray-400">
                        <div className="flex items-center space-x-2">
                          <Image
                            alt="Like/Unlike"
                            src={userLike ? FullHear : EmptyHear}
                            width={24}
                            onClick={() => handleRedirectCLik(postObj.post_id)}
                            height={24}
                            className="cursor-pointer"
                          />
                          <p>Likes: {postObj.likes.count || 0}</p>
                          <Image
                            src={CommIc}
                            onClick={() => handleRedirectCLik(postObj.post_id)}
                            width={24}
                            height={24}
                            alt="Comment Icon"
                            className="cursor-pointer"
                          />
                          <p>
                            Comments:
                            {commentsByPost[postObj.post_id]?.length || 0}
                          </p>
                        </div>
                        <button
                          className="cursor-pointer"
                          onClick={() => handleRedirectCLik(postObj.post_id)}
                        >
                          Liked by
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div>No matches found</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
