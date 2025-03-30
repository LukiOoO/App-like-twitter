"use client";

import "./globals.css";
import { Toaster } from "react-hot-toast";
import PostsWallUndfiend from "./postsWallUnd/postsWallUn";

export default function Start() {
  return (
    <div>
      <Toaster />
      <PostsWallUndfiend />
    </div>
  );
}
