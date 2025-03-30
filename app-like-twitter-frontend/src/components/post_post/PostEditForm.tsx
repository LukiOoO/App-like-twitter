"use client";

import React, { useState, useRef } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import TagManager from "@/components/post_post/TagManager";
import MediaUploads, { MediaConfig } from "@/components/common/MediaUploads";
import FindTags from "@/app/findTagsWindow/findTagsWindow";
import CreateTag from "@/app/createTagWindow/createTagWindow";
import Button from "@/components/common/Button";
import { PostEditFormProps } from "@/types/porps/props";

const PostEditForm: React.FC<PostEditFormProps> = ({
  post,
  refreshPost,
  cancelEdit,
}) => {
  const [selectedTags, setSelectedTags] = useState<string[]>(post.tags || []);
  const [newPostContent, setNewPostContent] = useState({
    text: post.text || "",
    image: post.image || null,
    video: post.video || null,
    gif: post.gif || null,
  });
  const [newFileUrls, setNewFileUrls] = useState({
    image: post.image || null,
    video: post.video || null,
    gif: post.gif || null,
  });
  const [showFindTags, setShowFindTags] = useState(false);
  const [showCreatedTagPopup, setShowCreatedTagPopup] = useState(false);

  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);
  const gifInputRef = useRef<HTMLInputElement | null>(null);

  const handleRemoveTag = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  };

  const toggleFindTags = () => setShowFindTags((prev) => !prev);
  const toggleCreateTag = () => setShowCreatedTagPopup((prev) => !prev);

  const handleFileChange = (
    variable: "image" | "video" | "gif",
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;
    const fileUrl = URL.createObjectURL(selectedFile);
    setNewFileUrls((prev) => ({ ...prev, [variable]: fileUrl }));
    setNewPostContent((prev) => ({ ...prev, [variable]: selectedFile }));
  };

  const updatePost = async () => {
    const formData = new FormData();
    formData.append("text", newPostContent.text);
    selectedTags.forEach((tag) => formData.append("tags", tag));
    if (post.image !== newPostContent.image) {
      newPostContent.image
        ? formData.append("image", newPostContent.image)
        : formData.append("image", "");
    }
    if (post.gif !== newPostContent.gif) {
      newPostContent.gif
        ? formData.append("gif", newPostContent.gif)
        : formData.append("gif", "");
    }
    if (post.video !== newPostContent.video) {
      newPostContent.video
        ? formData.append("video", newPostContent.video)
        : formData.append("video", "");
    }
    try {
      await axios.put(
        `http://127.0.0.1:8000/p_w/user-post-manager/${post.post_id}/`,
        formData,
        {
          headers: {
            Authorization: `JWT ${Cookies.get("access")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Post został zaktualizowany");
      refreshPost();
      cancelEdit();
    } catch (error: any) {
      console.log(error);
      toast.error("Aktualizacja nie powiodła się.");
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
        setNewPostContent((prev) => ({ ...prev, image: null }));
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
        setNewPostContent((prev) => ({ ...prev, gif: null }));
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
        setNewPostContent((prev) => ({ ...prev, video: null }));
        setNewFileUrls((prev) => ({ ...prev, video: null }));
      },
      onFileChange: (e) => handleFileChange("video", e),
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="space-y-6 m-5 w-full max-w-3xl">
        <TagManager
          selectedTags={selectedTags}
          onRemoveTag={handleRemoveTag}
          onToggleCreateTag={toggleCreateTag}
          onToggleFindTags={toggleFindTags}
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
            onClick={updatePost}
            buttonClassName="bg-slate-700 hover:bg-slate-800 text-white font-semibold py-2 px-4 rounded-lg transition-all"
            ariaLabel="Submit post"
          >
            Submit
          </Button>
          <Button
            onClick={() => cancelEdit()}
            buttonClassName="bg-slate-700 hover:bg-slate-800 text-white font-semibold py-2 px-4 rounded-lg transition-all"
            ariaLabel="Cancel"
          >
            Cancel
          </Button>
        </div>
        {showFindTags && (
          <FindTags
            togglePopup={() => setShowFindTags((prev) => !prev)}
            onTagClick={(tag) => setSelectedTags((prev) => [...prev, tag])}
          />
        )}
        {showCreatedTagPopup && (
          <CreateTag
            togglePopup={() => setShowCreatedTagPopup((prev) => !prev)}
            setShowCreatedTagPopup={setShowCreatedTagPopup}
            jusCreatedTag={(tag) =>
              setSelectedTags((prev) => [...prev, `#${tag.toUpperCase()}`])
            }
          />
        )}
      </div>
    </div>
  );
};

export default PostEditForm;
