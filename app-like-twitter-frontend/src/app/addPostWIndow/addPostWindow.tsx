"use client";

import "../globals.css";
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

type Props = {
  togglePopup: (event: React.MouseEvent<HTMLElement>) => void;
  setCreatePostWinPopup: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function AddPost({ togglePopup, setCreatePostWinPopup }: Props) {
  const [showFindTags, setShowFindTags] = useState(false);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);
  const gifInputRef = useRef<HTMLInputElement | null>(null);
  const [showCreatedTagPopup, setShowCreatedTagPopup] = useState(false);
  const [justCreatedTag, setJustCreatedTag] = useState("");

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

  const [newFileUrls, setNewFileUrls] = useState<{
    image: string | null;
    video: string | null;
    gif: string | null;
  }>({
    image: null,
    video: null,
    gif: null,
  });
  const createPost = async () => {
    const formData = new FormData();
    formData.append("text", newPostContent.text);
    selectedTags.forEach((tag) => {
      formData.append("tags", tag);
    });

    if (newPostContent.image) {
      formData.append("image", newPostContent.image);
    } else {
      formData.append("image", "");
    }
    if (newPostContent.gif) {
      formData.append("gif", newPostContent.gif);
    } else {
      formData.append("gif", "");
    }
    if (newPostContent.video) {
      formData.append("video", newPostContent.video);
    } else {
      formData.append("video", "");
    }
    try {
      const response = await axios.post(
        "  http://127.0.0.1:8000/p_w/user-post-manager/",
        formData,
        {
          headers: {
            Authorization: `JWT  ${Cookies.get("access")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("The post was created");
      setCreatePostWinPopup(false);
    } catch (error: any) {
      if (error.response.data) {
        const errorString = JSON.stringify(error.response);
        console.log(errorString);

        toast.error(
          `${errorString.split("{")[2].split("'")[1]}  - ${errorString.split("string='")[1].split(".")[0]}`
        );
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  const togglePopupFindTags = () => {
    setShowFindTags(!showFindTags);
  };
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const handleRemoveTag = (tag: string) => {
    setSelectedTags(selectedTags.filter((selectedTag) => selectedTag !== tag));
  };
  const togglePopupCreatedTag = () => {
    setShowCreatedTagPopup(!showCreatedTagPopup);
  };

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
  const handleTagClick = (tag: string) => {
    if (!selectedTags?.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };
  const handleCreateTag = (tag: string) => {
    setJustCreatedTag(tag);
    setSelectedTags([...selectedTags, `#${tag.toUpperCase()}`]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="space-y-6 m-5 w-full max-w-3xl">
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
                  <p className="text-xs text-gray-400">No tags selected.</p>
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
              onClick={createPost}
            >
              Submit
            </button>

            <button
              onClick={() => setCreatePostWinPopup(false)}
              className="text-gray-300 bg-lighterDark hover:bg-gray-800 px-4 py-2 rounded-lg shadow"
            >
              Cancel
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
    </div>
  );
}
