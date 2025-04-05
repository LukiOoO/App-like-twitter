"use client";

import React, { useState, useRef } from "react";
import { toast, Toaster } from "react-hot-toast";

import "../globals.css";

import Button from "@/components/common/Button";
import MediaUploads, { MediaConfig } from "@/components/common/MediaUploads";
import TagManager from "@/components/post_post/TagManager";

import FindTags from "@/app/findTagsWindow/findTagsWindow";
import CreateTag from "@/app/createTagWindow/createTagWindow";

import { useMediaUpload } from "@/hooks/useMediaHandling";

import { AddPostProps } from "@/types/porps/props";

import { createPostApi } from "@/utils/api";

export default function AddPost({
  togglePopup,
  setCreatePostWinPopup,
}: AddPostProps) {
  const { newFileUrls, newPostContent, setNewPostContent, handleFileChange } =
    useMediaUpload();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFindTags, setShowFindTags] = useState(false);
  const [showCreatedTagPopup, setShowCreatedTagPopup] = useState(false);

  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);
  const gifInputRef = useRef<HTMLInputElement | null>(null);

  const createPost = async () => {
    const formData = new FormData();
    formData.append("text", newPostContent.text);
    selectedTags.forEach((tag) => formData.append("tags", tag));
    formData.append("image", newPostContent.image ? newPostContent.image : "");
    formData.append("gif", newPostContent.gif ? newPostContent.gif : "");
    formData.append("video", newPostContent.video ? newPostContent.video : "");

    try {
      await createPostApi(formData);
      toast.success("The post was created");
      setCreatePostWinPopup(false);
    } catch (error: any) {
      if (error.response?.data) {
        toast.error("Post must contain the tag and text");
      } else {
        toast.error("Something went wrong");
      }
    }
  };
  const handleTagClick = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleRemoveTag = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  };

  const handleCreateTag = (tag: string) => {
    setSelectedTags([...selectedTags, `#${tag.toUpperCase()}`]);
  };

  const togglePopupFindTags = () => setShowFindTags((prev) => !prev);
  const togglePopupCreatedTag = () => setShowCreatedTagPopup((prev) => !prev);

  const mediaConfigs: MediaConfig[] = [
    {
      label: "Image",
      type: "image",
      fileUrl: newFileUrls.image,
      inputAccept: "image/*",
      inputRef: imageInputRef,
      onEdit: () => imageInputRef.current?.click(),
      onRemove: () => {
        setNewPostContent((prev) => ({ ...prev, image: null }));
      },
      onFileChange: (e) => handleFileChange("image", e),
    },
    {
      label: "GIF",
      type: "gif",
      fileUrl: newFileUrls.gif,
      inputAccept: "image/gif",
      inputRef: gifInputRef,
      onEdit: () => gifInputRef.current?.click(),
      onRemove: () => {
        setNewPostContent((prev) => ({ ...prev, gif: null }));
      },
      onFileChange: (e) => handleFileChange("gif", e),
    },
    {
      label: "Video",
      type: "video",
      fileUrl: newFileUrls.video,
      inputAccept: "video/*",
      inputRef: videoInputRef,
      onEdit: () => videoInputRef.current?.click(),
      onRemove: () => {
        setNewPostContent((prev) => ({ ...prev, video: null }));
      },
      onFileChange: (e) => handleFileChange("video", e),
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <Toaster />
      <div className="space-y-6 m-5 w-full max-w-3xl">
        <div className="bg-gradient-to-r from-lighterDark to-gray-900 p-6 rounded-xl shadow-xl hover:shadow-2xl">
          <TagManager
            selectedTags={selectedTags}
            onRemoveTag={handleRemoveTag}
            onToggleCreateTag={togglePopupCreatedTag}
            onToggleFindTags={togglePopupFindTags}
          />

          <div className="mb-4">
            <input
              type="text"
              className="w-full p-2 rounded-md bg-slate-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-500"
              placeholder="Enter text here"
              aria-label="Text input"
              value={newPostContent.text}
              onChange={(e) =>
                setNewPostContent({ ...newPostContent, text: e.target.value })
              }
            />
          </div>

          <div className="flex flex-col mb-4 space-y-4">
            <MediaUploads mediaConfigs={mediaConfigs} />
          </div>

          <div className="flex justify-center space-x-2">
            <Button
              onClick={createPost}
              buttonClassName="bg-slate-700 hover:bg-slate-800 text-white font-semibold py-2 px-4 rounded-lg transition-all"
              ariaLabel="Submit post"
            >
              Submit
            </Button>
            <Button
              onClick={() => setCreatePostWinPopup(false)}
              buttonClassName="bg-slate-700 hover:bg-slate-800 text-white font-semibold py-2 px-4 rounded-lg transition-all"
              ariaLabel="Cancel"
            >
              Cancel
            </Button>
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
