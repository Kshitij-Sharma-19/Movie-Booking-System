import { useEffect, useState } from "react";

export const useAuth = () => {
const [token, setToken] = useState(() => localStorage.getItem("token"));


  useEffect(() => {
    const stored = localStorage.getItem("token");
    setToken(stored);
  }, []);

  return {
    isAuthenticated: !!token,
    token,
  };
};
