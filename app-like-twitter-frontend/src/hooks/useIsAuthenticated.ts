import Cookies from "js-cookie";

export const useIsAuthenticated = (): boolean => {
  const token = Cookies.get("access");
  return !!token;
};
