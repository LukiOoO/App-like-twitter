"use client";
import "./globals.css";
import axios from "axios";
import Header from "@/components/Header";
import { Toaster } from "react-hot-toast";
import PostsWallUndfiend from "./postsWallUnd/postsWallUn";
import React, { useState, useEffect } from "react";

export default function Start() {
  return (
    <div>
      <Toaster />
      <PostsWallUndfiend />
    </div>
  );
}
