"use client";
import "./globals.css";
import axios from "axios";
import Header from "@/components/Header";
import { Toaster } from "react-hot-toast";
import PostsWallUndfiend from "./postsWallUnd/postsWallUn";

export default function Start() {
  return (
    <div>
      <Toaster />
      <Header />
      <div className="flex">
        <div className="w-4/5 flex h-screen border-lighterDark border-x-4  ">
          <div className="w-4/5 flex justify-center ">
            <PostsWallUndfiend />
          </div>
          <div className="w-1/5">Add post</div>
        </div>
        <div className="w-1/5 h-screen border-lighterDark  border-r-4">
          tu search post by tag <hr />
          Search users itp itd <hr /> only for looog user when click undloog ope
          logg windows
        </div>
      </div>
    </div>
  );
}
