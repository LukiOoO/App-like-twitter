"use client";

import { useState } from "react";

const useLogout = (logOutUser: () => void) => {
  const [error, setError] = useState<Error | null>(null);

  const handleLogout = async () => {
    try {
      await logOutUser();
    } catch (err: any) {
      console.error("Logout failed", err);
      setError(err);
    }
  };

  return { handleLogout, error };
};

export default useLogout;
