"use client";

import { useState } from "react";
import Cookies from "js-cookie";

const useLogout = (logOutUser: () => void) => {
  const [error, setError] = useState<Error | null>(null);

  const handleLogout = async () => {
    try {
      const allCookies = Cookies.get();          
      Object.keys(allCookies).forEach(cookieName => {
        Cookies.remove(cookieName);
      });

      await logOutUser();
    } catch (err: any) {
      console.error("Logout failed", err);
      setError(err);
    }
  };

  return { handleLogout, error };
};

export default useLogout;