"use client";

import "../globals.css";
import React, { useState, useRef } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import Image from "next/image";
import RemoveIc from "@/assets/remove.png";
import Pencil from "@/assets/pencil.png";

type Props = {
  togglePopup: (event: React.MouseEvent<HTMLElement>) => void;
  setcreateComWinpopup: React.Dispatch<React.SetStateAction<boolean>>;
  postComments: () => void;
  id: string;
};

export default function CreateComment({
  togglePopup,
  setcreateComWinpopup,
  postComments,
  id,
}: Props) {
  const [newComment, setNewComment] = useState<{
    text: string;
    image: File | null;
    video: File | null;
    gif: File | null;
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

  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);
  const gifInputRef = useRef<HTMLInputElement | null>(null);

  const createComment = async () => {
    const formData = new FormData();
    formData.append("text", newComment.text);

    if (newComment.image) {
      formData.append("image", newComment.image);
    } else {
      formData.append("image", "");
    }
    if (newComment.gif) {
      formData.append("gif", newComment.gif);
    } else {
      formData.append("gif", "");
    }
    if (newComment.video) {
      formData.append("video", newComment.video);
    } else {
      formData.append("video", "");
    }
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/p_w/show_user_posts/${id}/comments/`,
        formData,
        {
          headers: {
            Authorization: `JWT  ${Cookies.get("access")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      await postComments();
      toast.success("The commentary was created");
      setcreateComWinpopup(false);
    } catch (error: any) {
      if (error.response.data) {
        const errorString = JSON.stringify(error.response["data"]);
        console.log(
          "asda",
          errorString.split("[")[1].split(".")[0].replace(/["\]]/g, "").trim()
        );

        toast.error(
          `${errorString.split("[")[0].split(":")[0].replace(/["{]/g, "")} - ${errorString.split("[")[1].split(".")[0].replace(/["\]]/g, "").trim()}`
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

  const handleFileChange = (type: "image" | "video" | "gif", event: any) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    const fileUrl = URL.createObjectURL(selectedFile);

    setNewFileUrls({ ...newFileUrls, [type]: fileUrl });
    setNewComment({ ...newComment, [type]: selectedFile });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto">
        <h2 className="text-lg font-bold mb-4">Add a Comment</h2>

        <textarea
          className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-300"
          placeholder="Enter your comment here"
          value={newComment.text}
          onChange={(e) =>
            setNewComment({
              ...newComment,
              text: e.target.value,
            })
          }
        />

        <div className="flex flex-col space-y-4 mt-4">
          {newComment.image !== null ? (
            <div className="flex items-center justify-between">
              <Image
                src={`${newFileUrls.image}`}
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
                  onClick={() =>
                    setNewComment({
                      ...newComment,
                      image: null,
                    })
                  }
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

          {newComment.gif !== null ? (
            <div className="flex items-center justify-between">
              <Image
                src={`${newFileUrls.gif}`}
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
                  onClick={() =>
                    setNewComment({
                      ...newComment,
                      gif: null,
                    })
                  }
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
              <input
                type="file"
                accept="image/gif"
                style={{ display: "none" }}
                ref={gifInputRef}
                onChange={(e) => handleFileChange("gif", e)}
              />
              <button
                className="w-full text-gray-400 hover:text-teal-500 transition"
                onClick={() => handlePencilClick("gif")}
              >
                Add GIF
              </button>
            </div>
          )}

          {newComment.video !== null ? (
            <div className="flex items-center justify-between">
              <video
                src={`${newFileUrls.video}`}
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
                  onClick={() =>
                    setNewComment({
                      ...newComment,
                      video: null,
                    })
                  }
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
            onClick={createComment}
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
        </div>
      </div>
    </div>
  );
}
