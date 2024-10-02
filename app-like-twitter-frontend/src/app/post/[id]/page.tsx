"use client";
import "../../globals.css";
import Header from "@/components/Header";
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

export default function PostDetails() {
  const router = useRouter();
  const [userLike, setUserLike] = useState(false);
  const [isAuthor, setIsAuthor] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showLikedByPopup, setShowLikedByPopup] = useState(false);
  const [showCreatedTagPopup, setShowCreatedTagPopup] = useState(false);
  const [showFindTags, setShowFindTags] = useState(false);
  const [justCreatedTag, setJustCreatedTag] = useState("");
  const [post, setPost] = useState<any[]>([]);
  const [newFileUrls, setNewFileUrls] = useState<{
    image: string | null;
    video: string | null;
    gif: string | null;
  }>({
    image: null,
    video: null,
    gif: null,
  });
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newPostContent, setNewPostContent] = useState<{
    text: string;
    image: string | null;
    video: string | null;
    gif: string | null;
    tags: string[];
  }>({
    text: "",
    image: null,
    video: null,
    gif: null,
    tags: [],
  });
  const pathname = usePathname();
  const id = pathname;

  const handleTagClick = (tag: string) => {
    if (!selectedTags?.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };
  const handleCreateTag = (tag: string) => {
    setJustCreatedTag(tag);
    setSelectedTags([...selectedTags, `#${tag.toUpperCase()}`]);
  };

  const handleRemoveTag = (tag: string) => {
    setSelectedTags(selectedTags.filter((selectedTag) => selectedTag !== tag));
  };
  console.log(selectedTags);

  const togglePopupLikedBy = () => {
    setShowLikedByPopup(!showLikedByPopup);
  };
  const togglePopupCreatedTag = () => {
    setShowCreatedTagPopup(!showCreatedTagPopup);
  };
  const togglePopupFindTags = () => {
    setShowFindTags(!showFindTags);
  };
  const followUnFollow = async () => {
    const response = await axios.post(
      "http://127.0.0.1:8000/p_w/show_user_posts/",
      {
        follow_unfollow_post: id.split("/")[2],
      },
      {
        headers: { Authorization: "JWT " + Cookies.get("access") },
      }
    );
    await postDetail();
    try {
    } catch (error: any) {
      console.log(error);
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPostContent({
      ...newPostContent,
      [e.target.name]: e.target.value,
    });
  };

  const postDetail = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/p_w/post-detail/?post_id=${id.split("/")[2]}`,
        {
          headers: { Authorization: "JWT " + Cookies.get("access") },
        }
      );

      setNewPostContent({
        text: response.data[0]["text"] || "",
        image: response.data[0]["image"] || null,
        video: response.data[0]["video"] || null,
        gif: response.data[0]["gif"] || null,
        tags: response.data[0]["tags"] || [],
      });

      setNewFileUrls({
        image: response.data[0]["image"] || null,
        video: response.data[0]["video"] || null,
        gif: response.data[0]["gif"] || null,
      });

      setPost(response.data);
    } catch (error: any) {
      console.log(error);
    }
  };

  const startTags = () => {
    if (post[0] && post[0]["tags"]) {
      const uniqueTags = post[0]["tags"].filter(
        (tag: string) => !selectedTags.includes(tag)
      );
      setSelectedTags([...selectedTags, ...uniqueTags]);
    }
  };

  useEffect(() => {
    if (post.length > 0) {
      const nick = Cookies.get("Nick");
      if (post[0].likes.liked_by.includes(nick)) {
        setUserLike(true);
      } else {
        setUserLike(false);
      }
    }
    const token = Cookies.get("access") || "";
    const decodedToken = jwt.decode(token);
    if (decodedToken && typeof decodedToken === "object") {
      const userId = decodedToken["user_id"];
      if (post[0] && post[0]["user_id"]) {
        if (post[0]["user_id"] === userId) {
          setIsAuthor(true);
        } else {
          setIsAuthor(false);
        }
      }
    }
  }, [post]);

  // console.log("post", post);
  // console.log("new post content", newPostContent);
  // console.log(userLike);
  // console.log(isEditing);
  // console.log("isAuthor", isAuthor);

  useEffect(() => {
    postDetail();
    postComments();
  }, []);

  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);
  const gifInputRef = useRef<HTMLInputElement | null>(null);

  // Handle click for specific input
  const handlePencilClick = (type: "image" | "video" | "gif") => {
    if (type === "image" && imageInputRef.current) {
      imageInputRef.current.click();
    } else if (type === "video" && videoInputRef.current) {
      videoInputRef.current.click();
    } else if (type === "gif" && gifInputRef.current) {
      gifInputRef.current.click();
    }
  };
  const handleFileChange = (virable: "image" | "video" | "gif", event: any) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    const fileUrl = URL.createObjectURL(selectedFile);

    setNewFileUrls({ ...newFileUrls, [virable]: fileUrl });

    setNewPostContent({
      ...newPostContent,
      [virable]: selectedFile,
    });
  };

  const updatePost = async () => {
    const formData = new FormData();
    formData.append("text", newPostContent.text);
    selectedTags.forEach((tag) => {
      formData.append("tags", tag);
    });

    console.log("TESTOWE ", post[0]["image"] === newPostContent.image);

    if (post[0]["image"] !== newPostContent.image) {
      if (newPostContent.image) {
        formData.append("image", newPostContent.image);
      } else {
        formData.append("image", "");
      }
    }
    if (post[0]["gif"] !== newPostContent.gif) {
      if (newPostContent.gif) {
        formData.append("gif", newPostContent.gif);
      } else {
        formData.append("gif", "");
      }
    }
    if (post[0]["video"] !== newPostContent.video) {
      if (newPostContent.video) {
        formData.append("video", newPostContent.video);
      } else {
        formData.append("video", "");
      }
    }
    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/p_w/user-post-manager/${id.split("/")[2]}/`,
        formData,
        {
          headers: {
            Authorization: `JWT  ${Cookies.get("access")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      await postDetail();
      toast.success("The post has been updated");
      setIsEditing(false);
    } catch (error: any) {
      if (error.response.data) {
        const errorString = JSON.stringify(error.response);
        console.log(errorString);
        toast.error(`TEXT - ${errorString.split("string='")[1].split(".")[0]}`);
      } else {
        toast.error("Something went wrong");
      }
    }
  };
  const deletePost = async () => {
    try {
      const response = await axios.delete(
        `http://127.0.0.1:8000/p_w/user-post-manager/${id.split("/")[2]}/`,
        {
          headers: {
            Authorization: `JWT  ${Cookies.get("access")}`,
          },
        }
      );
      router.push("/logHome");
      toast.success("The post has been deleted");
    } catch (error: any) {
      console.log(error);
    }
  };

  const [comments, setComments] = useState<any[]>([]);
  const [createComWinpopup, setcreateComWinpopup] = useState(false);

  console.log("COMMENST", comments);
  const togglePopupCreateCom = () => {
    setcreateComWinpopup(!createComWinpopup);
  };

  const postComments = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/p_w/show_user_posts/${id.split("/")[2]}/comments/`,
        {
          headers: { Authorization: "JWT " + Cookies.get("access") },
        }
      );
      setComments(response.data);
    } catch (error: any) {
      console.log(error);
    }
  };
  const moveToUserProfile = async (nickname: string) => {
    router.push(`/userProfile/${nickname}`);
  };

  return (
    <div>
      <Toaster />
      <Header />
      <div className="flex flex-col sm:flex-row sm:justify-between m-5 space-y-4 sm:space-y-0 sm:space-x-4 h-screen">
        <div className="w-full sm:w-2/3 flex flex-col">
          <div className="flex-1 overflow-y-auto scrollbar-hide sm:w-[60%] sm:mx-auto">
            {post.length > 0 ? (
              <div className="space-y-6">
                {post.map((postObj: any, index: number) => (
                  <div key={index}>
                    <div className="bg-gradient-to-r from-lighterDark to-gray-900 p-6 rounded-xl shadow-xl hover:shadow-2xl">
                      <div className="flex justify-between items-center mb-2">
                        <p
                          className="font-semibold text-sm  hover:text-teal-600 cursor-pointer"
                          onClick={() => moveToUserProfile(postObj.user)}
                        >
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
                        <p className="text-gray-200 text-sm">{postObj.text}</p>
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
                            height={24}
                            className="cursor-pointer"
                            onClick={followUnFollow}
                          />
                          <p>Likes: {postObj.likes.count || 0}</p>
                          <Image
                            src={CommIc}
                            width={24}
                            height={24}
                            onClick={togglePopupCreateCom}
                            alt="Comment Icon"
                            className="cursor-pointer"
                          />
                          <p>Comments: {comments.length || 0}</p>
                        </div>
                        <button
                          className="cursor-pointer"
                          onClick={togglePopupLikedBy}
                        >
                          Liked by
                        </button>
                        {showLikedByPopup && (
                          <LikedBy
                            postId={postObj.post_id}
                            togglePopup={togglePopupLikedBy}
                            likeUsers={postObj.likes.liked_by}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {isAuthor && (
                  <div className="mb-4 text-center">
                    <button
                      className="text-gray-300 bg-lighterDark hover:bg-gray-800 px-4 py-2 rounded-lg shadow"
                      onClick={() => {
                        setIsEditing(!isEditing);
                        startTags();
                      }}
                    >
                      {isEditing ? "Cancel" : "Edit Post"}
                    </button>
                  </div>
                )}
                {isEditing && (
                  <div className="space-y-6 m-5">
                    <div className="bg-gradient-to-r from-lighterDark to-gray-900 p-6 rounded-xl shadow-xl hover:shadow-2xl">
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <p
                            className="text-sm text-teal-600 cursor-pointer"
                            onClick={() => setShowFindTags(!showFindTags)}
                          >
                            Find tags
                          </p>
                          <div className="mt-2">
                            {selectedTags.length > 0 ? (
                              selectedTags.map((tag: string, index: number) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between"
                                >
                                  <p className="text-xs text-teal-600">{tag}</p>
                                  {selectedTags.length > 1 && (
                                    <Image
                                      alt="Remove Icon"
                                      width={16}
                                      height={16}
                                      src={RemoveIc}
                                      className="opacity-50 hover:opacity-80 cursor-pointer"
                                      onClick={() => handleRemoveTag(tag)}
                                    />
                                  )}
                                </div>
                              ))
                            ) : (
                              <p className="text-xs text-gray-400">
                                No tags selected.
                              </p>
                            )}
                          </div>
                        </div>
                        <p
                          className="text-sm text-teal-600 cursor-pointer"
                          onClick={togglePopupCreatedTag}
                        >
                          Create tag
                        </p>
                      </div>
                      <div className="flex flex-col mb-4 space-y-4">
                        <input
                          type="text"
                          className="w-full p-2 rounded-md bg-slate-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-500"
                          placeholder="Enter text here"
                          aria-label="Text input"
                          value={newPostContent.text}
                          onChange={(e) =>
                            setNewPostContent({
                              ...newPostContent,
                              text: e.target.value,
                            })
                          }
                        />
                        <div>
                          {newPostContent.image ? (
                            <div className="flex items-center space-x-4">
                              <Image
                                src={`${newFileUrls.image}`}
                                alt="Image"
                                width={64}
                                height={64}
                                className="object-cover rounded-md"
                              />
                              <div className="flex space-x-2">
                                <Image
                                  src={Pencil}
                                  alt="Edit Image"
                                  onClick={() => handlePencilClick("image")}
                                  width={24}
                                  height={24}
                                  className="cursor-pointer"
                                />
                                <Image
                                  src={RemoveIc}
                                  alt="Remove Image"
                                  onClick={() =>
                                    setNewPostContent({
                                      ...newPostContent,
                                      image: null,
                                    })
                                  }
                                  width={24}
                                  height={24}
                                  className="opacity-50 hover:opacity-80 cursor-pointer"
                                />
                              </div>
                              <input
                                type="file"
                                accept="image/*"
                                ref={imageInputRef}
                                onChange={(e) => handleFileChange("image", e)}
                                className="hidden"
                              />
                            </div>
                          ) : (
                            <div>
                              <p
                                onClick={() => handlePencilClick("image")}
                                className="text-slate-300 cursor-pointer hover:text-teal-600 text-sm"
                              >
                                Add Image
                              </p>
                              <input
                                type="file"
                                accept="image/*"
                                ref={imageInputRef}
                                onChange={(e) => handleFileChange("image", e)}
                                className="hidden"
                              />
                            </div>
                          )}
                        </div>
                        <div>
                          {newPostContent.gif ? (
                            <div className="flex items-center space-x-4">
                              <Image
                                src={`${newFileUrls.gif}`}
                                alt="GIF"
                                width={64}
                                height={64}
                                className="object-cover rounded-md"
                              />
                              <div className="flex space-x-2">
                                <Image
                                  src={Pencil}
                                  alt="Edit GIF"
                                  onClick={() => handlePencilClick("gif")}
                                  width={24}
                                  height={24}
                                  className="cursor-pointer"
                                />
                                <Image
                                  src={RemoveIc}
                                  alt="Remove GIF"
                                  onClick={() =>
                                    setNewPostContent({
                                      ...newPostContent,
                                      gif: null,
                                    })
                                  }
                                  width={24}
                                  height={24}
                                  className="opacity-50 hover:opacity-80 cursor-pointer"
                                />
                              </div>
                              <input
                                type="file"
                                accept="image/gif"
                                ref={gifInputRef}
                                onChange={(e) => handleFileChange("gif", e)}
                                className="hidden"
                              />
                            </div>
                          ) : (
                            <div>
                              <p
                                onClick={() => handlePencilClick("gif")}
                                className="text-slate-300 cursor-pointer hover:text-teal-600 text-sm"
                              >
                                Add GIF
                              </p>

                              <input
                                type="file"
                                accept="image/gif"
                                ref={gifInputRef}
                                onChange={(e) => handleFileChange("gif", e)}
                                className="hidden"
                              />
                            </div>
                          )}
                        </div>
                        <div>
                          {newPostContent.video ? (
                            <div className="flex items-center space-x-4">
                              <video
                                src={`${newFileUrls.video}`}
                                controls
                                className="w-16 h-16 object-cover rounded-md"
                              />
                              <div className="flex space-x-2">
                                <Image
                                  src={Pencil}
                                  alt="Edit Video"
                                  onClick={() => handlePencilClick("video")}
                                  width={24}
                                  height={24}
                                  className="cursor-pointer"
                                />
                                <Image
                                  src={RemoveIc}
                                  alt="Remove Video"
                                  onClick={() =>
                                    setNewPostContent({
                                      ...newPostContent,
                                      video: null,
                                    })
                                  }
                                  width={24}
                                  height={24}
                                  className="opacity-50 hover:opacity-80 cursor-pointer"
                                />
                              </div>
                              <input
                                type="file"
                                accept="video/*"
                                ref={videoInputRef}
                                onChange={(e) => handleFileChange("video", e)}
                                className="hidden"
                              />
                            </div>
                          ) : (
                            <div>
                              <p
                                onClick={() => handlePencilClick("video")}
                                className="text-slate-300 cursor-pointer hover:text-teal-600 text-sm"
                              >
                                Add Video
                              </p>
                              <input
                                type="file"
                                accept="video/*"
                                ref={videoInputRef}
                                onChange={(e) => handleFileChange("video", e)}
                                className="hidden"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-center space-x-2">
                        <button
                          className="text-gray-300 bg-lighterDark hover:bg-gray-800 px-4 py-2 rounded-lg shadow"
                          onClick={updatePost}
                        >
                          Submit
                        </button>
                        <button
                          onClick={deletePost}
                          className="text-gray-300 bg-slate-700 hover:bg-red-950 px-4 py-2 rounded-lg shadow"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    {showFindTags && (
                      <FindTags
                        togglePopup={togglePopupFindTags}
                        onTagClick={handleTagClick}
                      />
                    )}
                    {showCreatedTagPopup && (
                      <CreateTag
                        togglePopup={togglePopupCreatedTag}
                        setShowCreatedTagPopup={setShowCreatedTagPopup}
                        jusCreatedTag={handleCreateTag}
                      />
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div>No matches found</div>
            )}
          </div>
        </div>

        <div className="w-full sm:w-1/3 flex flex-col">
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            {comments ? (
              <div className="space-y-6">
                {comments
                  .slice()
                  .reverse()
                  .map((commentObj: any, index: number) => (
                    <div
                      key={index}
                      className="bg-gradient-to-tl from-lighterDark to-gray-950 p-6 rounded-xl shadow-xl"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <p
                          className="text-xs font-semibold hover:text-teal-600 cursor-pointer"
                          onClick={() =>
                            moveToUserProfile(commentObj.user_nickname)
                          }
                        >
                          {commentObj.user_nickname}
                        </p>
                        <div className="text-gray-400 text-xs">
                          {new Date(commentObj.created_at).toLocaleDateString()}{" "}
                          {new Date(commentObj.created_at).toLocaleTimeString()}
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
              <div>No matches found</div>
            )}
            {createComWinpopup && (
              <CreateComment
                id={id.split("/")[2]}
                togglePopup={togglePopupCreateCom}
                postComments={postComments}
                setcreateComWinpopup={setcreateComWinpopup}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
