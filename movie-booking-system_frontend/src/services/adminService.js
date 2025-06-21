import axiosInstance from "./axiosInstance";
const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const getAllUsers = () =>
  axiosInstance.get(`${BASE_URL}/user-service/api/v1/users`);
// export const getAllBookings = () =>
//   axiosInstance.get(`${BASE_URL}/booking-service/api/v1/admin/bookings`);
// export const getAllPayments = () =>
//   axiosInstance.get(`${BASE_URL}/payment-service/api/v1/admin/payments`);
export const getAllTheaters = () =>
  axiosInstance.get(`${BASE_URL}/movie-catalog-service/api/v1/theaters`);

export const createTheater = (data) =>
  axiosInstance.post(`${BASE_URL}/movie-catalog-service/api/v1/admin/theaters`, data);