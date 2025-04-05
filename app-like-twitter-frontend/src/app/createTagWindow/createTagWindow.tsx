"use client";

import React, { useState } from "react";
import { toast } from "react-hot-toast";

import "../globals.css";

import { CreateTagProps } from "@/types/porps/props";

import Button from "@/components/common/Button";

import { createTagApi } from "@/utils/api";

export default function CreateTag({
  togglePopup,
  setShowCreatedTagPopup,
  jusCreatedTag,
}: CreateTagProps) {
  const [newTag, setNewTag] = useState({
    tag: "",
  });

  const createTag = async () => {
    try {
      await createTagApi(newTag.tag);
      setShowCreatedTagPopup(false);
      toast.success(`The #${newTag.tag.toUpperCase()} tag was created`);
    } catch (error: any) {
      if (error.response?.data) {
        toast.error(`${error.response.data}`);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <div
      className="fixed top-0 left-0 z-50 w-full h-full bg-black bg-opacity-75 flex items-center justify-center"
      onClick={togglePopup}
    >
      <div
        className="bg-darkGray rounded-lg p-4 shadow-lg w-80 md:w-96 max-h-[80%] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          type="text"
          className="bg-lighterDark text-white rounded-lg w-full p-2 mb-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-600"
          placeholder="Create Tag"
          onChange={(e) => setNewTag({ ...newTag, tag: e.target.value })}
        />
        <Button
          onClick={() => {
            createTag();
            jusCreatedTag(newTag.tag);
          }}
          buttonClassName="mt-4 bg-slate-700 hover:bg-slate-800 text-white font-semibold py-2 px-4 rounded-lg transition-all"
        >
          Submit
        </Button>
        <Button
          onClick={togglePopup}
          buttonClassName="mt-4 bg-slate-700 hover:bg-slate-800 text-white font-semibold py-2 px-4 rounded-lg transition-all"
        >
          Close
        </Button>
      </div>
    </div>
  );
}
