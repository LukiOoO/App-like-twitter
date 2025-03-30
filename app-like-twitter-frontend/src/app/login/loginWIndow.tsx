"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import axios from "axios";
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";
import PopupContainer from "@/components/loginregister/PopupContainer";
import FormInput from "@/components/loginregister/FormInput";
import Button from "@/components/common/Button";
import { PopupProps } from "@/types/porps/props";

const Login: React.FC<PopupProps> = ({ togglePopup }) => {
  const router = useRouter();
  const [activeBtn, setActiveBtn] = useState(false);
  const [userData, setUserData] = useState({
    nickname: "",
    password: "",
  });

  const validateFields = () => {
    if (userData.nickname !== "" && userData.password !== "") {
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
      toast.success("Logged in");
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
    <PopupContainer togglePopup={togglePopup}>
      <h2 className="text-2xl mb-4 text-center">Login</h2>
      <FormInput
        type="text"
        id="nickname"
        name="nickname"
        placeholder="email"
        value={userData.nickname}
        onChange={(e) => setUserData({ ...userData, nickname: e.target.value })}
      />
      <FormInput
        type="password"
        id="password"
        name="password"
        placeholder="password"
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
