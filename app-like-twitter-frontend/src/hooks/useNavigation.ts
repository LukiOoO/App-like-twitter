"use client";

import { useRouter } from "next/navigation";

const useNavigation = () => {
  const router = useRouter();

  const navigateTo = (targetRoute: any) => {
    router.push(targetRoute);
  };

  return { navigateTo };
};

export default useNavigation;
