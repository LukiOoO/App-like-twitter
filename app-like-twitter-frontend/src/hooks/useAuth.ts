"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const useAuth = () => {
  const [tokenAvailable, setTokenAvailable] = useState(false);
  const [userNickname, setUserNickname] = useState("");

  const tokenInMemoryCheck = () => {
    if (Cookies.get("access")) {
      setTokenAvailable(true);
    } else {
      setTokenAvailable(false);
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
      Cookies.set("Nick", response.data.nickname);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const logOutUser = () => {
    Cookies.remove("access");
    Cookies.remove("refresh");
    Cookies.remove("Nick");
    setTokenAvailable(false);
    window.location.reload();
  };

  useEffect(() => {
    tokenInMemoryCheck();
  }, []);

  useEffect(() => {
    if (tokenAvailable) {
      getUserNickname();
    }
  }, [tokenAvailable]);

  return {
    tokenAvailable,
    userNickname,
    logOutUser,
  };
};

export default useAuth;
