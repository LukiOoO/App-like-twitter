"use client";

import React, { useState, useRef, ChangeEvent } from "react";
import { toast } from "react-hot-toast";

import "../globals.css";

import Button from "@/components/common/Button";
import MediaUploadField from "@/components/common/MediaUploadField";

import { CreateCommentProps } from "@/types/porps/props";

import { createCommentApi } from "@/utils/api";

export default function CreateComment({
  togglePopup,
  setcreateComWinpopup,
  postComments,
  id,
}: CreateCommentProps) {
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
    formData.append("image", newComment.image ? newComment.image : "");
    formData.append("gif", newComment.gif ? newComment.gif : "");
    formData.append("video", newComment.video ? newComment.video : "");

    try {
      await createCommentApi(id, formData);
      await postComments();
      toast.success("The commentary was created");
      setcreateComWinpopup(false);
    } catch (error: any) {
      if (error.response?.data) {
        const errorString = JSON.stringify(error.response.data);
        const message =
          errorString.split("[")[0].split(":")[0].replace(/["{]/g, "") +
          " - " +
          errorString.split("[")[1].split(".")[0].replace(/["\]]/g, "").trim();
        toast.error(message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  const handleFileChange = (
    type: "image" | "video" | "gif",
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;
    const fileUrl = URL.createObjectURL(selectedFile);
    setNewFileUrls((prev) => ({ ...prev, [type]: fileUrl }));
    setNewComment((prev) => ({ ...prev, [type]: selectedFile }));
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
            setNewComment((prev) => ({ ...prev, text: e.target.value }))
          }
        />

        <div className="flex flex-col space-y-4 mt-4">
          <MediaUploadField
            label="Image"
            fileUrl={newFileUrls.image}
            onEdit={() =>
              imageInputRef.current && imageInputRef.current.click()
            }
            onRemove={() => {
              setNewComment((prev) => ({ ...prev, image: null }));
              setNewFileUrls((prev) => ({ ...prev, image: null }));
            }}
            inputAccept="image/*"
            inputRef={imageInputRef}
            onFileChange={(e) => handleFileChange("image", e)}
          />

          <MediaUploadField
            label="GIF"
            fileUrl={newFileUrls.gif}
            onEdit={() => gifInputRef.current && gifInputRef.current.click()}
            onRemove={() => {
              setNewComment((prev) => ({ ...prev, gif: null }));
              setNewFileUrls((prev) => ({ ...prev, gif: null }));
            }}
            inputAccept="image/gif"
            inputRef={gifInputRef}
            onFileChange={(e) => handleFileChange("gif", e)}
          />

          <MediaUploadField
            label="Video"
            fileUrl={newFileUrls.video}
            onEdit={() =>
              videoInputRef.current && videoInputRef.current.click()
            }
            onRemove={() => {
              setNewComment((prev) => ({ ...prev, video: null }));
              setNewFileUrls((prev) => ({ ...prev, video: null }));
            }}
            inputAccept="video/*"
            inputRef={videoInputRef}
            onFileChange={(e) => handleFileChange("video", e)}
          />
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <Button
            onClick={createComment}
            buttonClassName="px-4 py-2 bg-teal-700 hover:bg-blue-700 text-white rounded-lg shadow-md transition"
            ariaLabel="Submit comment"
          >
            Submit
          </Button>

          <Button
            onClick={togglePopup}
            buttonClassName="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg shadow-md transition"
            ariaLabel="Cancel"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
