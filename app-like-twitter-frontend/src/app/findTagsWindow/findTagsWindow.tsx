"use client";

import "../globals.css";
import React, { useEffect, useState } from "react";
import axios from "axios";

type Props = {
  togglePopup: (event: React.MouseEvent<HTMLElement>) => void;
  onTagClick: (tag: string) => void;
};

export default function FindTags({ togglePopup, onTagClick }: Props) {
  const [tags, setTags] = useState([]);
  const [searchTags, setSearchTags] = useState("");
  const handleSearchTags = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTags(e.target.value.toUpperCase());
  };

  const getTags = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/t/all-tags/");
      setTags(response.data);
    } catch (error: any) {
      console.log(error);
    }
  };
  console.log(tags);

  useEffect(() => {
    getTags();
  }, []);

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
          type="search"
          className="bg-lighterDark text-white rounded-lg w-full p-2 mb-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-600"
          placeholder="Search..."
          value={searchTags}
          onChange={handleSearchTags}
        />

        <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-gray-500 max-h-60 p-2">
          {tags?.length > 0 ? (
            tags
              .filter((tag: any) => tag.tag.includes(searchTags))
              .map((tagObj: any, index: number) => (
                <p
                  onClick={() => onTagClick(tagObj.tag)}
                  key={index}
                  className="text-white bg-lightDark p-2 rounded-lg mb-2 hover:bg-slate-600 transition-colors"
                >
                  {tagObj.tag}
                </p>
              ))
          ) : (
            <p className="text-center text-gray-500">No tags</p>
          )}
        </div>
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