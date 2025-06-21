import axiosInstance from "./axiosInstance";
import axios from "axios";
const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const getAllMovies = () =>
  axiosInstance.get(`${BASE_URL}/movie-catalog-service/api/v1/movies`);

export const getMovieById = (id) =>
  axiosInstance.get(`${BASE_URL}/movie-catalog-service/api/v1/movies/${id}`);

export const searchMovies = (title) =>
  axios.get(`${BASE_URL}/movie-catalog-service/api/v1/movies/title/${encodeURIComponent(title)}`);

export const filterMovies = (genre, rating) =>
  axiosInstance.get(`${BASE_URL}/movie-catalog-service/api/v1/movies/filter?genre=${genre}&rating=${rating}`);

export const createMovie = (movieData) =>
  axiosInstance.post(`${BASE_URL}/movie-catalog-service/api/v1/movies`, movieData);


export const createShowtime = (data) => {
  return axiosInstance.post("/movie-catalog-service/api/v1/showtimes", data);
};

export const getShowtimesByMovieId = (movieId) =>
  axios.get(`${BASE_URL}/movie-catalog-service/api/v1/showtimes/movie/${movieId}`);