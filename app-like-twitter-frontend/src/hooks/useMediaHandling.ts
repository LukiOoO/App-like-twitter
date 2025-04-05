import { useState } from "react";
import { ChangeEvent } from "react";

export function useMediaUpload() {
  const [newFileUrls, setNewFileUrls] = useState<{
    image: string | null;
    video: string | null;
    gif: string | null;
  }>({
    image: null,
    video: null,
    gif: null,
  });
  const [newPostContent, setNewPostContent] = useState<{
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

  const handleFileChange = (
    type: "image" | "video" | "gif",
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;
    const fileUrl = URL.createObjectURL(selectedFile);
    setNewFileUrls((prev) => ({ ...prev, [type]: fileUrl }));
    setNewPostContent((prev) => ({ ...prev, [type]: selectedFile }));
  };

  return { newFileUrls, newPostContent, setNewPostContent, handleFileChange };
}
