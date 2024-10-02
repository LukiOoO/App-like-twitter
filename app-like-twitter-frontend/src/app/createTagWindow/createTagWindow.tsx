"use client";

import "../globals.css";
import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";

type Props = {
  togglePopup: (event: React.MouseEvent<HTMLElement>) => void;
  setShowCreatedTagPopup: React.Dispatch<React.SetStateAction<boolean>>;
  jusCreatedTag: (tag: string) => void;
};

export default function CreateTag({
  togglePopup,
  setShowCreatedTagPopup,
  jusCreatedTag,
}: Props) {
  const [newTag, setNewTag] = useState({
    tag: "",
  });
  const createTag = async () => {
    try {
      const request = await axios.post(
        "http://127.0.0.1:8000/t/user-tags-list/",
        { tag: newTag.tag },
        {
          headers: {
            Authorization: `JWT  ${Cookies.get("access")}`,
          },
        }
      );
      setShowCreatedTagPopup(false);
      toast.success(`The #${newTag.tag.toUpperCase()} tag was created`);
    } catch (error: any) {
      if (error.response.data) {
        toast.error(`${error.response.data}`);
      } else {
        toast.error("Something went wrong");
      }
      console.log(error);
    }
  };
  console.log(newTag);

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
        <button
          onClick={() => {
            createTag(), jusCreatedTag(newTag.tag);
          }}
          className="mt-4 bg-slate-700 hover:bg-slate-800 text-white font-semibold py-2 px-4 rounded-lg transition-all"
        >
          Subbmit
        </button>
        <button
          onClick={togglePopup}
          className="mt-4 bg-slate-700 hover:bg-slate-800 text-white font-semibold py-2 px-4 rounded-lg transition-all"
        >
          Close
        </button>
      </div>
    </div>
  );
}
