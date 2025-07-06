import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const loginUserAPI = (data) => {
  return axios.post(`${BASE_URL}/auth-service/api/v1/auth/login`, data);
};

export const registerUserAPI = (data) => {
  return axios.post(`${BASE_URL}/auth-service/api/v1/auth/signup`, data);
};
