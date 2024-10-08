"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import "../globals.css";

type PopupProps = {
  togglePopup: (event: React.MouseEvent<HTMLElement>) => void;
  setShowPopupLogin: React.Dispatch<React.SetStateAction<boolean>>;
  setShowPopupRegister: React.Dispatch<React.SetStateAction<boolean>>;
};

require("dotenv").config();

export default function Register({
  togglePopup,
  setShowPopupLogin,
  setShowPopupRegister,
}: PopupProps) {
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
      const regisetr = await axios.post(`http://127.0.0.1:8000/u/users/`, {
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
      userData.password1 != "" &&
      userData.password2 != "" &&
      userData.nickname != ""
    ) {
      setActiveBtn(true);
    } else if (userData.password1 != userData.password2) {
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
    <div
      className="fixed top-0 left-0 z-50 w-full h-full bg-black bg-opacity-75 flex items-center justify-center"
      onClick={togglePopup}
    >
      <div
        className="bg-somegray p-10 rounded-lg shadow-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl mb-4 text-center">Register</h2>
        <div className="mb-4">
          <input
            onChange={(e) =>
              setUserData({ ...userData, nickname: e.target.value })
            }
            type="text"
            id="nickname"
            name="nickname"
            placeholder="nickname"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black"
          />
        </div>
        <div className="mb-4">
          <input
            onChange={(e) =>
              setUserData({ ...userData, email: e.target.value })
            }
            type="email"
            id="email"
            name="email"
            placeholder="email"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black"
          />
        </div>
        <div className="mb-6">
          <input
            onChange={(e) =>
              setUserData({ ...userData, password1: e.target.value })
            }
            type="password"
            id="1password"
            name="1password"
            placeholder="first password"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black"
          />
        </div>
        <div className="mb-6">
          <input
            onChange={(e) =>
              setUserData({ ...userData, password2: e.target.value })
            }
            type="password"
            id="2password"
            name="2password"
            placeholder="seccond password"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black"
          />
        </div>
        {activeBtn ? (
          <>
            <button
              onClick={registerUser}
              type="submit"
              className="bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition duration-300"
            >
              Register
            </button>
          </>
        ) : (
          <>
            <span>{message}</span>
          </>
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
