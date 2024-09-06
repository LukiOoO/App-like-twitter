"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Image from "next/image";
import Login from "@/app/login/loginWIndow";
import Register from "@/app/register/registerWindow";
import LoginImg from "@/assets/login.png";
import RegisterImg from "@/assets/register.png";
import LogOutImg from "@/assets/logout.png";
import UserAccImg from "@/assets/useracc.png";
import WebPageImg from "@/assets/webpage.png";
import axios from "axios";
import { usePathname } from "next/navigation";

export default function LeftSitePanel() {
  const router = useRouter();
  const pathname = usePathname();
  const [showPopupRegister, setShowPopupRegister] = useState(false);
  const [showPopupLogin, setShowPopupLogin] = useState(false);
  const [tokenAvailable, setTokenAvailable] = useState(false);
  const [userNickname, setUserNickname] = useState("");

  const tokenInMemoryCheack = () => {
    if (Cookies.get("access")) {
      setTokenAvailable(true);
    }
  };

  const getUserNickname = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/u/auth/users/me/",
        {
          headers: { Authorization: "JWT " + Cookies.get("access") },
        }
      );
      setUserNickname(response.data.nickname);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (tokenAvailable) {
      getUserNickname();
    }
  }, [tokenAvailable]);

  const logOutUser = () => {
    Cookies.remove("access");
    Cookies.remove("refresh");
    window.location.reload();
  };

  const togglePopupLogin = () => {
    setShowPopupLogin(!showPopupLogin);
  };
  const togglePopupRegister = () => {
    setShowPopupRegister(!showPopupRegister);
  };

  useEffect(() => {
    tokenInMemoryCheack();
  }, [tokenAvailable]);

  return (
    <div className="w-full h-auto">
      {!tokenAvailable ? (
        <ul className="flex flex-col sm:flex-row bg-lighterDark">
          <li className="flex flex-col items-center p-4 sm:p-6 hover:bg-somegray transition delay-125">
            <button
              className="flex w-full sm:w-28 h-full items-center justify-center"
              onClick={togglePopupLogin}
            >
              <span className="mr-2">Login</span>
              <Image src={LoginImg} alt="LoginImg" width={30} height={30} />
            </button>
            {showPopupLogin && <Login togglePopup={togglePopupLogin} />}
          </li>
          <li className="flex flex-col items-center p-4 sm:p-6 hover:bg-somegray transition delay-150">
            <button
              className="flex w-full sm:w-28 h-full items-center justify-center"
              onClick={togglePopupRegister}
            >
              <span className="mr-2">Register</span>
              <Image
                src={RegisterImg}
                alt="RegisterImg"
                width={30}
                height={30}
              />
            </button>
            {showPopupRegister && (
              <Register
                togglePopup={togglePopupRegister}
                setShowPopupLogin={setShowPopupLogin}
                setShowPopupRegister={setShowPopupRegister}
              />
            )}
          </li>
        </ul>
      ) : (
        <ul className="flex flex-col sm:flex-row bg-lighterDark">
          <li className="flex flex-col items-center p-4 sm:p-6">
            {userNickname.toUpperCase()}
          </li>

          {pathname === "/logHome" ? (
            <li className="flex flex-col items-center p-4 sm:p-6 hover:bg-somegray transition delay-125 sm:ml-auto">
              <button
                className="flex w-full sm:w-28 h-full items-center justify-center"
                onClick={() => {
                  router.push("/profile");
                }}
              >
                <span className="mr-2">Profile</span>
                <Image src={UserAccImg} alt="profile" width={30} height={30} />
              </button>
            </li>
          ) : (
            <li className="flex flex-col items-center p-4 sm:p-6 hover:bg-somegray transition delay-125 sm:ml-auto">
              <button
                className="flex w-full sm:w-28 h-full items-center justify-center"
                onClick={() => {
                  router.push("/logHome");
                }}
              >
                <span className="mr-2">Post Wall</span>
                <Image src={WebPageImg} alt="profile" width={30} height={30} />
              </button>
            </li>
          )}

          <li className="flex flex-col items-center p-4 sm:p-6 sm:ml-auto">
            <button
              onClick={logOutUser}
              className="flex w-28  h-full items-center hover:bg-neutral-800 justify-center rounded-lg bg-somegray"
            >
              <span className="mr-2">Logout</span>
              <Image src={LogOutImg} alt="logout" width={20} height={20} />
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}
