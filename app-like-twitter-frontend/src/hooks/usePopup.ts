"use client";

import { useState, useEffect } from "react";

const usePopup = (registerShouldPopup: boolean) => {
  const [showPopupRegister, setShowPopupRegister] = useState(false);
  const [showPopupLogin, setShowPopupLogin] = useState(false);

  const togglePopupLogin = () => {
    setShowPopupLogin(!showPopupLogin);
  };

  const togglePopupRegister = () => {
    setShowPopupRegister(!showPopupRegister);
  };

  useEffect(() => {
    if (registerShouldPopup) {
      setShowPopupRegister((prev) => !prev);
    }
  }, [registerShouldPopup]);

  return {
    showPopupRegister,
    showPopupLogin,
    togglePopupLogin,
    togglePopupRegister,
    setShowPopupLogin,
    setShowPopupRegister,
  };
};

export default usePopup;
