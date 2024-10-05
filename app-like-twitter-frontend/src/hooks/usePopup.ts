"use client";

import { useState, useEffect } from "react";

const usePopup = (RegisterShouldPopup: boolean) => {
  const [showPopupRegister, setShowPopupRegister] = useState(false);
  const [showPopupLogin, setShowPopupLogin] = useState(false);

  const togglePopupLogin = () => {
    setShowPopupLogin(!showPopupLogin);
  };

  const togglePopupRegister = () => {
    setShowPopupRegister(!showPopupRegister);
  };

  useEffect(() => {
    if (RegisterShouldPopup) {
      setShowPopupRegister((prev) => !prev);
    }
  }, [RegisterShouldPopup]);

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
