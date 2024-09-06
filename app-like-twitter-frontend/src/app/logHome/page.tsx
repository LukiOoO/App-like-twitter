"use client";
import "../globals.css";
import axios from "axios";
import Header from "@/components/Header";
import { Toaster } from "react-hot-toast";

export default function PostsWall() {
  return (
    <div>
      <Toaster />
      <Header />
      <div className="flex">
        <div className="w-4/5 flex h-screen border-x-4 border-lighterDark ">
          <div className="w-4/5  flex justify-center ">
            <h1 className="w-1/2 bg-blue-900 text-center">Post Wall looog</h1>
          </div>
          <div className="w-1/5">Add post</div>
        </div>
        <div className="w-1/5 h-screen border-lighterDark border-r-4">
          tu search post by tag <hr />
          Search users itp itd <hr /> only for looog user when click undloog ope
          logg windows
        </div>
      </div>
    </div>
  );
}
