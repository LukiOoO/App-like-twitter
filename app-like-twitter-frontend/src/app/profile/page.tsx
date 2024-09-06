"use client";
import "../globals.css";
import axios from "axios";
import Header from "@/components/Header";
import { Toaster } from "react-hot-toast";

export default function ProfilePage() {
  return (
    <div className="">
      <Header />
      <div className="flex h-screen w-screen">
        <div>User data</div>
        <div>Your posts</div>
        <div>Your tags</div>
      </div>
    </div>
  );
}
