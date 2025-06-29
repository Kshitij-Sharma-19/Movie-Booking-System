import axiosInstance from "./axiosInstance";
import axios from "axios";
const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const getAllMovies = () =>
  axiosInstance.get(`${BASE_URL}/movie-catalog-service/api/v1/movies`);

export const getMovieById = (id) =>
  axiosInstance.get(`${BASE_URL}/movie-catalog-service/api/v1/movies/${id}`);

export const searchMovies = (title) =>
  axios.get(`${BASE_URL}/movie-catalog-service/api/v1/movies/title/${encodeURIComponent(title)}`);

// export const filterMovies = (genre, rating) =>
//   axiosInstance.get(`${BASE_URL}/movie-catalog-service/api/v1/movies/filter?genre=${genre}&rating=${rating}`);

export const filterMovies = (name, city, date) =>
  axios.get(`${BASE_URL}/movie-catalog-service/api/v1/showtimes/movie/search?name=${name}&city=${city}&date=${date}`);

export const createMovie = (movieData) =>
  axiosInstance.post(`${BASE_URL}/movie-catalog-service/api/v1/movies`, movieData);


export const createShowtime = (data) => {
  return axiosInstance.post("/movie-catalog-service/api/v1/showtimes", data);
};

export const getShowtimesByMovieId = (movieId) =>
  axios.get(`${BASE_URL}/movie-catalog-service/api/v1/showtimes/movie/${movieId}`);

export const getShowtimeById = (showtimeId) =>
  axios.get(`${BASE_URL}/movie-catalog-service/api/v1/showtimes/${showtimeId}`);

export const deleteShowtime = (showtimeId) =>
  axiosInstance.delete(`${BASE_URL}/movie-catalog-service/api/v1/showtimes/${showtimeId}`);

export const updateMovie = (id, movieData) =>
  axiosInstance.put(`${BASE_URL}/movie-catalog-service/api/v1/movies/${id}`, movieData);

export const deleteMovie = (id) =>
  axiosInstance.delete(`${BASE_URL}/movie-catalog-service/api/v1/movies/${id}`);