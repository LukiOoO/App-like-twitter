"use client";

import "../globals.css";
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import Image from "next/image";
import RemoveIc from "@/assets/remove.png";
import Pencil from "@/assets/pencil.png";

interface CommentType {
  gif: string | null;
  id: number;
  image: string | null;
  text: string;
  user_id: number;
  user_nickname: string;
  video: string | null;
  post_id: number;
}

type Props = {
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

export default function EditCommentWindow({
  togglePopup,
  getUserComments,
  setIsEditingComment,
  commentObj,
}: Props) {
  const [newCommentContent, setNewCommentContent] = useState<{
    text: string;
    image: string | File | null;
    video: string | File | null;
    gif: string | File | null;
  }>({
    text: "",
    image: null,
    video: null,
    gif: null,
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

  useEffect(() => {
    setNewFileUrls({
      image: commentObj.image,
      gif: commentObj.gif,
      video: commentObj.video,
    });

    setNewCommentContent((prevState) => ({
      ...prevState,
      text: commentObj.text,
      image: commentObj.image,
      gif: commentObj.gif,
      video: commentObj.video,
    }));
  }, [commentObj]);

  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);
  const gifInputRef = useRef<HTMLInputElement | null>(null);

  const editComment = async () => {
    const formData = new FormData();
    formData.append("text", newCommentContent.text);

    if (commentObj.image !== newCommentContent.image) {
      if (newCommentContent.image instanceof File) {
        formData.append("image", newCommentContent.image);
      } else if (newCommentContent.image === null) {
        formData.append("image", "");
      }
    }

    if (commentObj.gif !== newCommentContent.gif) {
      if (newCommentContent.gif instanceof File) {
        formData.append("gif", newCommentContent.gif);
      } else if (newCommentContent.gif === null) {
        formData.append("gif", "");
      }
    }

    if (commentObj.video !== newCommentContent.video) {
      if (newCommentContent.video instanceof File) {
        formData.append("video", newCommentContent.video);
      } else if (newCommentContent.video === null) {
        formData.append("video", "");
      }
    }

    try {
      await axios.put(
        `http://127.0.0.1:8000/p_w/show_user_posts/${commentObj.post_id}/comments/${commentObj.id}/`,
        formData,
        {
          headers: {
            Authorization: `JWT ${Cookies.get("access")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      await getUserComments();
      setIsEditingComment({
        editComment: false,
        comment_id: null,
      });
      toast.success("The comment was edited");
    } catch (error: any) {
      if (error.response.data) {
        const errorString = JSON.stringify(error.response["data"]);
        toast.error(
          `${errorString.split("[")[0].split(":")[0].replace(/["{]/g, "")} - ${errorString
            .split("[")[1]
            .split(".")[0]
            .replace(/["\]]/g, "")
            .trim()}`
        );
      } else {
        toast.error("Something went wrong");
      }
    }
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

  const handleFileChange = (
    type: "image" | "video" | "gif",
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    const fileUrl = URL.createObjectURL(selectedFile);

    setNewFileUrls({ ...newFileUrls, [type]: fileUrl });
    setNewCommentContent({ ...newCommentContent, [type]: selectedFile });
  };

  const deleteComment = async () => {
    try {
      await axios.delete(
        `http://127.0.0.1:8000/p_w/show_user_posts/${commentObj.post_id}/comments/${commentObj.id}/`,
        {
          headers: {
            Authorization: `JWT ${Cookies.get("access")}`,
          },
        }
      );
      toast.success("The comment has been deleted");
      await getUserComments();
      setIsEditingComment({
        editComment: false,
        comment_id: null,
      });
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto">
        <h2 className="text-lg font-bold mb-4">Edit Comment</h2>

        <textarea
          className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-300"
          placeholder="Enter your comment here"
          value={newCommentContent.text}
          onChange={(e) =>
            setNewCommentContent({
              ...newCommentContent,
              text: e.target.value,
            })
          }
        />

        <div className="flex flex-col space-y-4 mt-4">
          {newFileUrls.image ? (
            <div className="flex items-center justify-between">
              <Image
                src={newFileUrls.image}
                alt="Uploaded Image"
                width={100}
                height={100}
                className="rounded-md"
              />
              <div className="flex space-x-2">
                <Image
                  src={Pencil}
                  alt="Edit Image"
                  className="cursor-pointer"
                  width={30}
                  height={30}
                  onClick={() => handlePencilClick("image")}
                />
                <Image
                  src={RemoveIc}
                  alt="Remove Image"
                  className="cursor-pointer"
                  width={30}
                  height={30}
                  onClick={() => {
                    setNewCommentContent({
                      ...newCommentContent,
                      image: null,
                    });
                    setNewFileUrls({
                      ...newFileUrls,
                      image: null,
                    });
                  }}
                />
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  ref={imageInputRef}
                  onChange={(e) => handleFileChange("image", e)}
                />
              </div>
            </div>
          ) : (
            <div>
              <button
                className="w-full text-gray-400 hover:text-teal-500 transition"
                onClick={() => handlePencilClick("image")}
              >
                Add Image
              </button>
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                ref={imageInputRef}
                onChange={(e) => handleFileChange("image", e)}
              />
            </div>
          )}

          {newFileUrls.gif ? (
            <div className="flex items-center justify-between">
              <Image
                src={newFileUrls.gif}
                alt="Uploaded GIF"
                width={100}
                height={100}
                className="rounded-md"
              />
              <div className="flex space-x-2">
                <Image
                  src={Pencil}
                  alt="Edit GIF"
                  className="cursor-pointer"
                  width={30}
                  height={30}
                  onClick={() => handlePencilClick("gif")}
                />
                <Image
                  src={RemoveIc}
                  alt="Remove GIF"
                  className="cursor-pointer"
                  width={30}
                  height={30}
                  onClick={() => {
                    setNewCommentContent({
                      ...newCommentContent,
                      gif: null,
                    });
                    setNewFileUrls({
                      ...newFileUrls,
                      gif: null,
                    });
                  }}
                />
                <input
                  type="file"
                  accept="image/gif"
                  style={{ display: "none" }}
                  ref={gifInputRef}
                  onChange={(e) => handleFileChange("gif", e)}
                />
              </div>
            </div>
          ) : (
            <div>
              <button
                className="w-full text-gray-400 hover:text-teal-500 transition"
                onClick={() => handlePencilClick("gif")}
              >
                Add GIF
              </button>
              <input
                type="file"
                accept="image/gif"
                style={{ display: "none" }}
                ref={gifInputRef}
                onChange={(e) => handleFileChange("gif", e)}
              />
            </div>
          )}

          {newFileUrls.video ? (
            <div className="flex items-center justify-between">
              <video
                src={newFileUrls.video}
                controls
                className="rounded-md"
                style={{ maxWidth: "150px", maxHeight: "150px" }}
              />
              <div className="flex space-x-2">
                <Image
                  src={Pencil}
                  alt="Edit Video"
                  className="cursor-pointer"
                  width={30}
                  height={30}
                  onClick={() => handlePencilClick("video")}
                />
                <Image
                  src={RemoveIc}
                  alt="Remove Video"
                  className="cursor-pointer"
                  width={30}
                  height={30}
                  onClick={() => {
                    setNewCommentContent({
                      ...newCommentContent,
                      video: null,
                    });
                    setNewFileUrls({
                      ...newFileUrls,
                      video: null,
                    });
                  }}
                />
                <input
                  type="file"
                  accept="video/*"
                  style={{ display: "none" }}
                  ref={videoInputRef}
                  onChange={(e) => handleFileChange("video", e)}
                />
              </div>
            </div>
          ) : (
            <div>
              <button
                className="w-full text-gray-400 hover:text-teal-500 transition"
                onClick={() => handlePencilClick("video")}
              >
                Add Video
              </button>
              <input
                type="file"
                accept="video/*"
                style={{ display: "none" }}
                ref={videoInputRef}
                onChange={(e) => handleFileChange("video", e)}
              />
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <button
            className="px-4 py-2 bg-teal-700 hover:bg-blue-700 text-white rounded-lg shadow-md transition"
            type="button"
            onClick={editComment}
          >
            Submit
          </button>
          <button
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg shadow-md transition"
            type="button"
            onClick={togglePopup}
          >
            Cancel
          </button>
          <button
            onClick={deleteComment}
            className="text-gray-300 bg-slate-700 hover:bg-red-950 px-4 py-2 rounded-lg shadow"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
