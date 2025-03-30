"use client";

import "../globals.css";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import Button from "@/components/common/Button";
import MediaUploads, { MediaConfig } from "@/components/common/MediaUploads";
import { EditCommentWindowProps } from "@/types/porps/props";

export default function EditCommentWindow({
  togglePopup,
  getUserComments,
  setIsEditingComment,
  commentObj,
}: EditCommentWindowProps) {
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
    setNewCommentContent({
      text: commentObj.text,
      image: commentObj.image,
      gif: commentObj.gif,
      video: commentObj.video,
    });
  }, [commentObj]);

  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);
  const gifInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (
    type: "image" | "video" | "gif",
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;
    const fileUrl = URL.createObjectURL(selectedFile);
    setNewFileUrls((prev) => ({ ...prev, [type]: fileUrl }));
    setNewCommentContent((prev) => ({ ...prev, [type]: selectedFile }));
  };

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
      setIsEditingComment({ editComment: false, comment_id: null });
      toast.success("The comment was edited");
    } catch (error: any) {
      if (error.response?.data) {
        const errorString = JSON.stringify(error.response.data);
        toast.error(
          `${errorString
            .split("[")[0]
            .split(":")[0]
            .replace(/["{]/g, "")} - ${errorString
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

  const deleteComment = async () => {
    try {
      await axios.delete(
        `http://127.0.0.1:8000/p_w/show_user_posts/${commentObj.post_id}/comments/${commentObj.id}/`,
        { headers: { Authorization: `JWT ${Cookies.get("access")}` } }
      );
      toast.success("The comment has been deleted");
      await getUserComments();
      setIsEditingComment({ editComment: false, comment_id: null });
    } catch (error: any) {
      console.log(error);
    }
  };

  const mediaConfigs: MediaConfig[] = [
    {
      label: "Image",
      type: "image",
      fileUrl: newFileUrls.image,
      inputAccept: "image/*",
      inputRef: imageInputRef,
      onEdit: () => imageInputRef.current && imageInputRef.current.click(),
      onRemove: () => {
        setNewCommentContent((prev) => ({ ...prev, image: null }));
        setNewFileUrls((prev) => ({ ...prev, image: null }));
      },
      onFileChange: (e) => handleFileChange("image", e),
    },
    {
      label: "GIF",
      type: "gif",
      fileUrl: newFileUrls.gif,
      inputAccept: "image/gif",
      inputRef: gifInputRef,
      onEdit: () => gifInputRef.current && gifInputRef.current.click(),
      onRemove: () => {
        setNewCommentContent((prev) => ({ ...prev, gif: null }));
        setNewFileUrls((prev) => ({ ...prev, gif: null }));
      },
      onFileChange: (e) => handleFileChange("gif", e),
    },
    {
      label: "Video",
      type: "video",
      fileUrl: newFileUrls.video,
      inputAccept: "video/*",
      inputRef: videoInputRef,
      onEdit: () => videoInputRef.current && videoInputRef.current.click(),
      onRemove: () => {
        setNewCommentContent((prev) => ({ ...prev, video: null }));
        setNewFileUrls((prev) => ({ ...prev, video: null }));
      },
      onFileChange: (e) => handleFileChange("video", e),
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto">
        <h2 className="text-lg font-bold mb-4">Edit Comment</h2>

        <textarea
          className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-300"
          placeholder="Enter your comment here"
          value={newCommentContent.text}
          onChange={(e) =>
            setNewCommentContent({ ...newCommentContent, text: e.target.value })
          }
        />

        <div className="flex flex-col space-y-4 mt-4">
          <MediaUploads mediaConfigs={mediaConfigs} />
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <Button
            onClick={editComment}
            buttonClassName="px-4 py-2 bg-teal-700 hover:bg-blue-700 text-white rounded-lg shadow-md transition"
            ariaLabel="Submit edited comment"
          >
            Submit
          </Button>
          <Button
            onClick={togglePopup}
            buttonClassName="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg shadow-md transition"
            ariaLabel="Cancel edit comment"
          >
            Cancel
          </Button>
          <Button
            onClick={deleteComment}
            buttonClassName="px-4 py-2 bg-slate-700 hover:bg-red-950 text-white rounded-lg shadow transition"
            ariaLabel="Delete comment"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
