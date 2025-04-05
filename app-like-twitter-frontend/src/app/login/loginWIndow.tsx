"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Cookies from "js-cookie";

import "../globals.css";

import PopupContainer from "@/components/loginregister/PopupContainer";
import FormInput from "@/components/loginregister/FormInput";
import Button from "@/components/common/Button";

import { PopupProps } from "@/types/porps/props";

import { loginUserApi } from "@/utils/api";

const Login: React.FC<PopupProps> = ({ togglePopup }) => {
  const router = useRouter();
  const [activeBtn, setActiveBtn] = useState(false);
  const [userData, setUserData] = useState({
    nickname: "",
    password: "",
  });

  const validateFields = () => {
    if (userData.nickname.trim() !== "" && userData.password.trim() !== "") {
      setActiveBtn(true);
    } else {
      setActiveBtn(false);
    }
  };

  const loginUser = async () => {
    try {
      const data = await loginUserApi(userData);
      Cookies.set("access", data.access);
      Cookies.set("refresh", data.refresh);
      toast.success("Logged in");
      router.push("/logHome");
    } catch (error: any) {
      console.error(error.message);
      if (error.response && error.response.data) {
        toast.error(
          `Something went wrong: ${error.response.data.detail || "Login failed"}`
        );
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  useEffect(() => {
    validateFields();
  }, [userData]);

  return (
    <PopupContainer togglePopup={togglePopup}>
      <h2 className="text-2xl mb-4 text-center">Login</h2>
      <FormInput
        type="text"
        id="nickname"
        name="nickname"
        placeholder="Email or Nickname"
        value={userData.nickname}
        onChange={(e) => setUserData({ ...userData, nickname: e.target.value })}
      />
      <FormInput
        type="password"
        id="password"
        name="password"
        placeholder="Password"
        value={userData.password}
        onChange={(e) => setUserData({ ...userData, password: e.target.value })}
      />
      {activeBtn ? (
        <Button
          onClick={loginUser}
          buttonClassName="bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition duration-300"
        >
          Login
        </Button>
      ) : (
        <span>Please type data</span>
      )}
      <Button
        onClick={togglePopup}
        buttonClassName="absolute top-2 right-2 bg-black text-white py-1 px-2 rounded"
      >
        Close
      </Button>
    </PopupContainer>
  );
};

export default Login;
