import axiosInstance from "./axiosInstance";
const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const getAvailableSeats = (showtimeId) =>
  axiosInstance.get(`${BASE_URL}/booking-service/api/v1/showtimes/${showtimeId}/seats`);

export const reserveSeats = (bookingData) =>
  axios.post(`${BASE_URL}/booking-service/api/v1/bookings/seats/reserve`, bookingData);

export const confirmBooking = (data) =>
  axiosInstance.post(`${BASE_URL}/booking-service/api/v1/bookings`, data);

export const getUserBookingHistory = () =>
  axiosInstance.get(`${BASE_URL}/booking-service/api/v1/bookings/my-bookings`);

export const deinitializeSeatsForShowtime = (showtimeId) =>
  axiosInstance.delete(`/admin/showtimes/${showtimeId}/deinitialize-seats`);

export const cancelBooking = (bookingId) =>
  axiosInstance.patch(`${BASE_URL}/booking-service/api/v1/bookings/${bookingId}/cancel`);