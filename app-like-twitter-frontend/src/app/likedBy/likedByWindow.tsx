"use client";

import React, { useState } from "react";

import "../globals.css";

import Button from "@/components/common/Button";

import { LikedByProps } from "@/types/porps/props";

export default function LikedBy({
  togglePopup,
  likeUsers,
  postId,
}: LikedByProps) {
  const [searchUsr, setSearchUsr] = useState("");
  const handleSearchUsr = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchUsr(e.target.value);
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
          type="search"
          className="bg-lighterDark text-white rounded-lg w-full p-2 mb-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-600"
          placeholder="Search..."
          value={searchUsr}
          onChange={handleSearchUsr}
        />

        <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-gray-500 max-h-60 p-2">
          {likeUsers?.length > 0 ? (
            likeUsers
              .filter((user: any) =>
                user.toLowerCase().includes(searchUsr.toLowerCase())
              )
              .map((user: any, index: number) => (
                <p
                  key={index}
                  className="text-white bg-lightDark p-2 rounded-lg mb-2 hover:bg-slate-600 transition-colors"
                >
                  {user}
                </p>
              ))
          ) : (
            <p className="text-center text-gray-500">Nobody likes this post</p>
          )}
        </div>

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
