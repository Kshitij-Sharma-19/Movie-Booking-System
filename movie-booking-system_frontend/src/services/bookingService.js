import axiosInstance from "./axiosInstance";
const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const getAvailableSeats = (showtimeId) =>
  axiosInstance.get(`${BASE_URL}/booking-service/api/v1/showtimes/${showtimeId}/seats`);

export const reserveSeats = (bookingData) =>
  axios.post(`${BASE_URL}/booking-service/api/v1/bookings/seats/reserve`, bookingData);

export const confirmBooking = (data) =>
  axiosInstance.post(`${BASE_URL}/booking-service/api/v1/bookings`, data);

export const getUserBookingHistory = (userId) =>
  axiosInstance.get(`${BASE_URL}/booking-service/api/v1/my-bookings`);
