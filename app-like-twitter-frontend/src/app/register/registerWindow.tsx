"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import PopupContainer from "@/components/loginregister/PopupContainer";
import FormInput from "@/components/loginregister/FormInput";
import Button from "@/components/common/Button";
import { PopupPropsRegister } from "@/types/porps/props";

export default function Register({
  togglePopup,
  setShowPopupLogin,
  setShowPopupRegister,
}: PopupPropsRegister) {
  const [activeBtn, setActiveBtn] = useState(false);
  const [userData, setUserData] = useState({
    email: "",
    nickname: "",
    password1: "",
    password2: "",
  });
  const [message, setMessage] = useState("Please type data");

  const registerUser = async () => {
    try {
      await axios.post(`http://127.0.0.1:8000/u/users/`, {
        nickname: userData.nickname,
        email: userData.email,
        password: userData.password1,
      });
      setShowPopupLogin(true);
      setShowPopupRegister(false);
      toast.success("The account was created");
    } catch (error: any) {
      if (error.response && error.response.data) {
        const errors = error.response.data;
        if (errors.nickname) {
          toast.error(`${errors.nickname}`);
        }
        if (errors.email) {
          toast.error(`${errors.email}`);
        }
        if (errors.password) {
          toast.error(`${errors.password}`);
        }
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  const validateFields = () => {
    const emailRegex = new RegExp(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
    const strongPasswordRegx = new RegExp(
      /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/
    );

    if (
      emailRegex.test(userData.email) &&
      strongPasswordRegx.test(userData.password1) &&
      userData.password1 === userData.password2 &&
      userData.password1 !== "" &&
      userData.password2 !== "" &&
      userData.nickname !== ""
    ) {
      setActiveBtn(true);
    } else if (userData.password1 !== userData.password2) {
      setMessage("Passwords don't match");
      setActiveBtn(false);
    } else if (
      userData.password2 === "" ||
      userData.password1 === "" ||
      userData.nickname === "" ||
      userData.email === ""
    ) {
      setMessage("Please type data");
      setActiveBtn(false);
    } else if (!emailRegex.test(userData.email)) {
      setMessage("Email format is not correct");
      setActiveBtn(false);
    } else if (!strongPasswordRegx.test(userData.password1)) {
      setMessage("Password is not strong enough ");
      setActiveBtn(false);
    } else {
      setActiveBtn(false);
    }
  };

  useEffect(() => {
    validateFields();
  }, [userData]);

  return (
    <PopupContainer togglePopup={togglePopup}>
      <h2 className="text-2xl mb-4 text-center">Register</h2>
      <FormInput
        type="text"
        id="nickname"
        name="nickname"
        placeholder="nickname"
        value={userData.nickname}
        onChange={(e) => setUserData({ ...userData, nickname: e.target.value })}
      />
      <FormInput
        type="email"
        id="email"
        name="email"
        placeholder="email"
        value={userData.email}
        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
      />
      <FormInput
        type="password"
        id="password1"
        name="password1"
        placeholder="first password"
        value={userData.password1}
        onChange={(e) =>
          setUserData({ ...userData, password1: e.target.value })
        }
      />
      <FormInput
        type="password"
        id="password2"
        name="password2"
        placeholder="second password"
        value={userData.password2}
        onChange={(e) =>
          setUserData({ ...userData, password2: e.target.value })
        }
      />
      {activeBtn ? (
        <Button
          onClick={registerUser}
          buttonClassName="bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition duration-300"
        >
          Register
        </Button>
      ) : (
        <span>{message}</span>
      )}
      <Button
        onClick={togglePopup}
        buttonClassName="absolute top-2 right-2 bg-black text-white py-1 px-2 rounded"
      >
        Close
      </Button>
    </PopupContainer>
  );
}
