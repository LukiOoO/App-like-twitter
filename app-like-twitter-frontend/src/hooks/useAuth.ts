"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { getUserProfile } from "@/utils/api";

const useAuth = () => {
  const [tokenAvailable, setTokenAvailable] = useState(false);
  const [userNickname, setUserNickname] = useState("");

  const tokenInMemoryCheck = () => {
    setTokenAvailable(!!Cookies.get("access"));
  };

  const fetchUserNickname = async () => {
    try {
      const response = await getUserProfile();
      setUserNickname(response.nickname);
      Cookies.set("Nick", response.nickname);
    } catch (error: any) {
      console.error(error);
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
      fetchUserNickname();
    }
  }, [tokenAvailable]);

  return {
    tokenAvailable,
    userNickname,
    logOutUser,
  };
};

export default useAuth;
