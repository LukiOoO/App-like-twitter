"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import axios from "axios";
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";
import "../globals.css";

type PopupProps = {
  togglePopup: (event: React.MouseEvent<HTMLElement>) => void;
};

export default function Login({ togglePopup }: PopupProps) {
  const router = useRouter();
  const [activeBtn, setActiveBtn] = useState(false);
  const [userData, setUSerData] = useState({
    nickname: "",
    password: "",
  });
  const validateFields = () => {
    if (userData.nickname != "" && userData.password != "") {
      setActiveBtn(true);
    } else {
      setActiveBtn(false);
    }
  };

  const loginUser = async () => {
    try {
      const userTokens = await axios.post(
        "http://127.0.0.1:8000/u/jwt/create",
        userData
      );
      Cookies.set("access", userTokens.data.access);
      Cookies.set("refresh", userTokens.data.refresh);
      toast.success("logged in");
      router.push("/logHome");
    } catch (error: any) {
      console.log(error.message);
      if (error.response && error.response.data) {
        const errors = error.response.data;
        if (errors.detail) {
          toast.error(`Something went wrong: ${errors.detail}`);
        }
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  useEffect(() => {
    validateFields();
  }, [userData]);

  return (
    <div
      className="fixed top-0 left-0 z-50 w-full h-full bg-black bg-opacity-75 flex items-center justify-center"
      onClick={togglePopup}
    >
      <div
        className="bg-somegray p-10 rounded-lg shadow-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl mb-4 text-center">Login</h2>
        <div className="mb-4">
          <input
            type="text"
            id="email"
            name="email"
            placeholder="email"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black"
            onChange={(e) =>
              setUSerData({ ...userData, nickname: e.target.value })
            }
          />
        </div>
        <div className="mb-6">
          <input
            type="password"
            id="password"
            name="password"
            placeholder="password"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black"
            onChange={(e) =>
              setUSerData({ ...userData, password: e.target.value })
            }
          />
        </div>
        {activeBtn ? (
          <button
            type="submit"
            className="bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition duration-300"
            onClick={loginUser}
          >
            Login
          </button>
        ) : (
          <span>Please type data</span>
        )}
        <button
          onClick={togglePopup}
          className="absolute top-2 right-2 bg-black text-white py-1 px-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
}
