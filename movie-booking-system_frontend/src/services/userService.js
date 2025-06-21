import axiosInstance from "./axiosInstance";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const getUserProfile = () => {
  return axiosInstance.get(`${BASE_URL}/user-service/api/v1/users/me`);
};

export const updateUserProfile = (updatedData) => {
  return axiosInstance.put(`${BASE_URL}/user-service/api/v1/users/me`, updatedData);
};