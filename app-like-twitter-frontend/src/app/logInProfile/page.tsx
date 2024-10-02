"use client";
import "../globals.css";
import axios from "axios";
import Header from "@/components/Header";
import { toast } from "react-hot-toast";
import Cookies from "js-cookie";
import Image from "next/image";
import Pencil from "@/assets/pencil.png";
import Subm from "@/assets/verified.png";
import { Checkbox } from "@nextui-org/checkbox";
import AnonymusImg from "@/assets/anonymous.png";
import { useRouter } from "next/navigation";
import { Toaster } from "react-hot-toast";
import jwt from "jsonwebtoken";
import EditCommentWindow from "@/app/editCommentWindow/editCommentWindow";
import RemoveIc from "@/assets/remove.png";

import React, { useState, useEffect, useRef } from "react";

export default function ProfilePage() {
  ///////////////// USER DATA
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const [isEditedNick, setIsEditedNick] = useState(false);
  const [isEditedEmail, setIsEditedEmail] = useState(false);
  const [isFrozenAccount, setIsFrozenAccount] = useState(false);
  const [isEditingComment, setIsEditingComment] = useState<{
    editComment: boolean;
    comment_id: number | null;
  }>({
    editComment: false,
    comment_id: null,
  });

  const [userData, setUserData] = useState({
    nickname: "",
    email: "",
    avatar: "",
    freeze_or_not: false,
  });

  const togglePopupEditCom = () => {
    setIsEditingComment({
      editComment: false,
      comment_id: null,
    });
  };

  const handleRedirectCLik = (postId: number) => {
    router.push(`/post/${postId}`);
  };

  const freezeAccount = async (freeze_or_not: boolean) => {
    try {
      const request = await axios.put(
        "http://127.0.0.1:8000/u/users/me/",
        {
          nickname: userData.nickname,
          email: userData.email,
          avatar: userData.avatar,
          freeze_or_not: freeze_or_not,
        },
        {
          headers: { Authorization: "JWT " + Cookies.get("access") },
        }
      );
    } catch (error: any) {
      console.log(error);
    }
  };
  const unFreezeAccount = async () => {
    try {
      const request = await axios.post(
        "http://127.0.0.1:8000/u/users/resend_activation/",
        {
          email: email,
        },
        {
          headers: { Authorization: "JWT " + Cookies.get("access") },
        }
      );
      toast.success("The account unfreezing email has been sent");
    } catch (error: any) {
      console.log(error);
    }
  };

  const changeUserData = async () => {
    try {
      const request = await axios.put(
        "http://127.0.0.1:8000/u/users/me/",
        {
          nickname: userData.nickname,
          email: userData.email,
          avatar: userData.avatar,
          freeze_or_not: userData.freeze_or_not,
        },
        {
          headers: { Authorization: "JWT " + Cookies.get("access") },
        }
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
      const request = await axios.post(
        "http://127.0.0.1:8000/u/users/reset_password/",
        {
          email: userData.email,
        }
      );
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

      console.log(response);
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
          const email = responseData["Your account is frozen"];
          setEmail(email);
        }
      } else {
        setError(true);
        console.log(error.message);
      }
    }
  };
  console.log(userData);
  console.log("is frozen", isFrozenAccount);

  useEffect(() => {
    getUserData();
  }, []);
  ////////////////////////////////////////// UPLOAD IMAGE
  const [avatar, setAvatar] = useState(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handlePencilClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
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
            Authorization: `JWT  ${Cookies.get("access")}`,
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

  //////////////////////// followers and follows and tags
  const [followsers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  const getFollower = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/u/your-followers/",
        {
          headers: {
            Authorization: `JWT  ${Cookies.get("access")}`,
          },
        }
      );

      const responseFollowers = response.data["Your followers"];

      setFollowers(response.data["Your followers"]);
      console.log(response.data["Your followers"]);

      console.log(followsers);
    } catch (error: any) {
      console.log(error);
    }
  };
  const removeF = async (id: number) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/u/you-can-unfollow/",
        {
          unfollow_user: id,
        },
        {
          headers: {
            Authorization: `JWT  ${Cookies.get("access")}`,
          },
        }
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
          headers: {
            Authorization: `JWT  ${Cookies.get("access")}`,
          },
        }
      );

      const responseFollowers = response.data["You are following"];

      setFollowing(response.data["You are following"]);
      console.log(response.data["You are following"]);

      console.log(followsers);
    } catch (error: any) {
      console.log(error);
    }
  };
  const [searchTerm, setSearchTerm] = useState("");
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredFollowing = following.filter((followingObj: any) =>
    followingObj.following[0].toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [tags, setTags] = useState([]);

  const getTags = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/t/user-tags-list/",
        {
          headers: {
            Authorization: `JWT ${Cookies.get("access")}`,
          },
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

  // Filter the following list based on the search term
  const filteredTag = Array.isArray(tags)
    ? tags.filter((tagObj: any) =>
        tagObj.tag.toLowerCase().includes(searchTermTag.toLowerCase())
      )
    : [];

  const removeT = async (id: number) => {
    try {
      const response = await axios.delete(
        `http://127.0.0.1:8000/t/user-tags-list/${id}/`,

        {
          headers: {
            Authorization: `JWT  ${Cookies.get("access")}`,
          },
        }
      );
      await getTags();
    } catch (error: any) {
      console.log(error);
    }
  };

  console.log("tags", tags);

  // Add search functionality for followers
  const [searchTermFollowers, setSearchTermFollowers] = useState("");
  const handleSearchFollowers = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTermFollowers(e.target.value);
  };

  const filteredFollowers = followsers.filter((followerObj: any) =>
    followerObj.follower[0]
      .toLowerCase()
      .includes(searchTermFollowers.toLowerCase())
  );

  ///////////////////////////////////////////posts and comments
  const [posts, setPosts] = useState([]);
  console.log("Nickname", userData.nickname);

  const getPost = async (nickname: string) => {
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
  console.log(posts);
  useEffect(() => {
    if (userData.nickname) {
      getPost(userData.nickname);
    }
  }, [userData.nickname]);
  console.log("post", posts.length > 0);

  /////////////////////////COMENTS?????????????????????

  const [comments, setComments] = useState([]);
  const getUserComments = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/u/all-user-comments/",
        {
          headers: {
            Authorization: `JWT  ${Cookies.get("access")}`,
          },
        }
      );
      setComments(response.data["Your comments"]);
    } catch (error: any) {
      console.log(error);
    }
  };

  console.log("commments ", comments);

  useEffect(() => {
    getUserComments();
    getFollower();
    getFollowing();
    getTags();
  }, []);

  return (
    <div className="">
      <Toaster />
      <Header />
      <div className="flex flex-col sm:flex-row h-screen w-full border-lighterDark border-x-4">
        <div className="w-full sm:w-2/5 h-auto sm:h-1/2 ">
          <div className="w-full flex flex-col items-center border-lighterDark border-b-4">
            {!isFrozenAccount ? (
              <>
                <p className="p-5 flex items-center">
                  <Image
                    src={userData?.avatar || AnonymusImg}
                    width={80}
                    height={80}
                    alt="User Image"
                    className="rounded-full object-cover"
                  />

                  <Image
                    className="cursor-pointer"
                    src={Pencil}
                    alt="Edit Avatar"
                    width={30}
                    height={30}
                    onClick={handlePencilClick}
                  />

                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                </p>
                <p className="p-5 flex">
                  {isEditedNick ? (
                    <input
                      className="bg-lighterDark"
                      type="email"
                      value={userData.nickname}
                      onChange={(e) =>
                        setUserData({
                          ...userData,
                          nickname: e.target.value,
                        })
                      }
                    />
                  ) : (
                    userData.nickname
                  )}
                  <Image
                    className="cursor-pointer"
                    src={isEditedNick ? Subm : Pencil}
                    width={30}
                    height={30}
                    alt={isEditedNick ? "Submit" : "Pencil"}
                    onClick={() => {
                      if (isEditedNick) {
                        setIsEditedNick(false);
                        changeUserData();
                      } else {
                        setIsEditedNick(true);
                        setIsEditedEmail(false);
                      }
                    }}
                  />
                </p>
                <p className="p-5 flex">
                  {isEditedEmail ? (
                    <input
                      className="bg-lighterDark"
                      type="email"
                      value={userData.email}
                      onChange={(e) =>
                        setUserData({ ...userData, email: e.target.value })
                      }
                    />
                  ) : (
                    userData.email
                  )}
                  <Image
                    className="cursor-pointer"
                    src={isEditedEmail ? Subm : Pencil}
                    width={30}
                    height={30}
                    alt={isEditedEmail ? "Submit" : "Pencil"}
                    onClick={() => {
                      if (isEditedEmail) {
                        setIsEditedEmail(false);
                        changeUserData();
                      } else {
                        setIsEditedEmail(true);
                        setIsEditedNick(false);
                      }
                    }}
                  />
                </p>
                <p className="p-5 flex space-x-1">
                  <span>Freeze Account</span>
                  <Checkbox
                    color="default"
                    isSelected={userData.freeze_or_not}
                    onChange={() => {
                      setUserData({
                        ...userData,
                        freeze_or_not: !userData.freeze_or_not,
                      });

                      freezeAccount(!userData.freeze_or_not);
                      setIsFrozenAccount(true);
                    }}
                  />
                </p>
                <p className="p-5 flex">
                  Change password
                  <Image
                    className="cursor-pointer"
                    src={Pencil}
                    alt="RegisterImg"
                    width={30}
                    height={30}
                    onClick={sendResetPasswordEmail}
                  />
                </p>
              </>
            ) : (
              <>
                <p className="p-5 flex space-x-1">
                  <span>Freeze Account</span>
                  <Checkbox
                    color="default"
                    defaultSelected={true}
                    onChange={() => {
                      unFreezeAccount();
                    }}
                  />
                </p>
              </>
            )}

            {error && <p>Something went wrong</p>}
          </div>

          <div className="mt-2 text-center h-1/3 border-lighterDark border-b-4">
            <div className="flex justify-around ">
              <input
                type="search"
                className="bg-lighterDark rounded-lg w-36 text-center"
                placeholder="Search..."
                value={searchTermFollowers}
                onChange={handleSearchFollowers}
              />
              <span className="text-xl font-bold text-white">
                Your followers ({followsers.length}):
              </span>
            </div>
            <ul className="h-5/6 overflow-y-scroll scrollbar-hide flex flex-col">
              {filteredFollowers.length > 0 ? (
                filteredFollowers.map((followerObj: any, index: number) => (
                  <li className="flex justify-center m-2" key={index}>
                    <p>
                      {followerObj.follower[0] !== Cookies.get("Nick")
                        ? followerObj.follower[0]
                        : ""}
                    </p>
                  </li>
                ))
              ) : (
                <li className="flex justify-center m-2">No matches found</li>
              )}
            </ul>
          </div>

          <div className="mt-2 text-center h-1/3 border-lighterDark border-b-4">
            <div className="flex justify-around ">
              <input
                type="search"
                className="bg-lighterDark rounded-lg w-36 text-center"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearch}
              />
              <span className="text-xl font-bold text-white">
                You Follow ({following.length}):
              </span>
            </div>
            <ul className="h-5/6 overflow-y-scroll scrollbar-hide flex flex-col">
              {filteredFollowing.length > 0 ? (
                filteredFollowing.map((followingObj: any, index: number) => (
                  <li className="flex justify-center m-2" key={index}>
                    <p>{followingObj.following[0]}</p>
                    <Image
                      className="ml-2 opacity-10 hover:opacity-80 cursor-pointer"
                      src={RemoveIc}
                      alt="Remove"
                      width={20}
                      onClick={() => {
                        removeF(followingObj.following[1]);
                      }}
                    />
                  </li>
                ))
              ) : (
                <li className="flex justify-center m-2">No matches found</li>
              )}
            </ul>
          </div>

          <div className=" mt-2 text-center h-1/3 ">
            <div className="flex justify-around ">
              <input
                type="search"
                className="bg-lighterDark rounded-lg w-36 text-center"
                placeholder="Search..."
                value={searchTermTag}
                onChange={handleSearchTag}
              />
              <span className="text-xl font-bold text-white">
                Your Tags ({Array.isArray(tags) ? tags.length : 0}):
              </span>
            </div>
            <ul className="h-5/6 overflow-y-scroll scrollbar-hide flex flex-col">
              {filteredTag.length > 0 ? (
                filteredTag.map((tagObj: any, index: number) => (
                  <li className="flex justify-center m-2" key={index}>
                    <p>{tagObj.tag}</p>
                    <Image
                      className="ml-2 opacity-10 hover:opacity-80 cursor-pointer"
                      src={RemoveIc}
                      alt="Remove"
                      width={20}
                      onClick={() => {
                        removeT(tagObj.tag_id);
                      }}
                    />
                  </li>
                ))
              ) : (
                <li className="flex justify-center m-2">No matches found</li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-72 sm:my-0 w-full sm:w-3/5 border-lighterDark border-l-4">
          <div className=" h-2/6 sm:h-1/2  text-center border-lighterDark border-b-4 p-4">
            <span className=" text-2xl font-bold text-slate-600 block  mb-1 animate-pulse">
              Your posts:
            </span>
            {posts.length > 0 ? (
              <div className=" h-[95%] overflow-y-scroll scrollbar-hide space-y-6">
                {posts
                  .slice()
                  .reverse()
                  .map((postObj: any, index: number) => (
                    <div key={index}>
                      <div
                        onClick={() => handleRedirectCLik(postObj.post_id)}
                        className="bg-gradient-to-r from-lighterDark to-gray-900 p-8 rounded-xl shadow-xl hover:shadow-2xl 
                      transform hover:scale-105 transition-all duration-300 ease-out"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <p> {postObj.user}</p>
                          <p className="text-sm text-teal-600 ">
                            {postObj.tags.map((tagObj: any) => tagObj + " ")}
                          </p>
                          <div className="text-gray-300 text-xs">
                            {new Date(postObj.created_at).toLocaleDateString()}
                            {new Date(postObj.created_at).toLocaleTimeString()}
                          </div>
                        </div>
                        <div className="text-center mb-4">
                          <p className="text-gray-200 text-sm break-all">
                            {postObj.text}
                          </p>
                        </div>
                        <div className="flex flex-col items-center mb-4 space-y-4">
                          {postObj.image && (
                            <img
                              src={postObj.image}
                              alt="post image"
                              className="rounded-md shadow-lg object-cover"
                              style={{ maxWidth: "300px", maxHeight: "200px" }}
                            />
                          )}

                          {postObj.gif && (
                            <img
                              src={postObj.gif}
                              alt="post gif"
                              className="rounded-md shadow-md object-cover"
                              style={{ maxWidth: "300px", maxHeight: "200px" }}
                            />
                          )}

                          {postObj.video && (
                            <video
                              src={postObj.video}
                              controls
                              className="rounded-md shadow-lg"
                              style={{ maxWidth: "300px", maxHeight: "200px" }}
                            />
                          )}
                        </div>

                        <div className="flex justify-between  items-center text-xs text-gray-300 ">
                          <p>Likes: {postObj.likes["count"] || 0} </p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div>No matches found</div>
            )}
          </div>
          <div className="h-2/6 sm:h-1/2  text-center border-lighterDark  p-4">
            <span className="text-2xl font-bold text-slate-600 block  mb-1 animate-pulse">
              Your comments:
            </span>
            {comments ? (
              <div className=" h-[95%] overflow-y-scroll scrollbar-hide space-y-6">
                {comments
                  .slice()
                  .reverse()
                  .map((commentObj: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-around space-x-2"
                    >
                      <div
                        onClick={() => handleRedirectCLik(commentObj.post_id)}
                        className="bg-gradient-to-tl from-lighterDark to-gray-950 p-8 rounded-xl shadow-xl hover:shadow-2xl 
                    transform hover:scale-105 transition-all duration-300 ease-out w-[90%]"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-xs font-semibold">
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
                      <button
                        className="text-gray-300 bg-lighterDark hover:bg-gray-800 px-4 py-2 rounded-lg shadow [writing-mode:vertical-lr] [text-orientation:upright]"
                        onClick={() => {
                          setIsEditingComment({
                            editComment: true,
                            comment_id: commentObj.id,
                          });
                        }}
                      >
                        {isEditingComment.editComment &&
                        commentObj.id === isEditingComment.comment_id
                          ? "Cancel"
                          : "Edit"}
                      </button>
                      {isEditingComment.editComment &&
                        commentObj.id === isEditingComment.comment_id && (
                          <EditCommentWindow
                            togglePopup={togglePopupEditCom}
                            setIsEditingComment={setIsEditingComment}
                            getUserComments={getUserComments}
                            commentObj={commentObj}
                          />
                        )}
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
