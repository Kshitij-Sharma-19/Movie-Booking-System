import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { loginUserAPI, registerUserAPI } from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    return token ? jwtDecode(token) : null;
  });

  const login = async (data) => {
    try {
      const res = await loginUserAPI(data);
      const token = res.data.accessToken;
      localStorage.setItem("token", token);
      setToken(token);
      setUser(jwtDecode(token));
      navigate("/");
    } catch (err) {
      throw err;
    }
  };

  const register = async (data) => {
    await registerUserAPI(data);
    navigate("/login");
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
    navigate("/login");
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, user, login, logout, register, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
