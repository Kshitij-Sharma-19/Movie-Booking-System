// src/components/admin/ShowtimeManagement.jsx

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Typography,
  Alert,
} from "@mui/material";
import axiosInstance from "../../services/axiosInstance";
import { getAllMovies } from "../../services/movieService";
import { getAllTheaters } from "../../services/adminService";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;
const ShowtimeManagement = () => {
  const [movies, setMovies] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const [showtimeData, setShowtimeData] = useState({
    movieId: "",
    theaterId: "",
    showtime: "",
    price: "",
    screenNumber: "",
    availableSeats: 300,
  });

  useEffect(() => {
    fetchMoviesAndTheaters();
  }, []);

  const fetchMoviesAndTheaters = async () => {
    try {
      const [movieRes, theaterRes] = await Promise.all([
        getAllMovies(),
        getAllTheaters(),
      ]);
      setMovies(movieRes.data);
      setTheaters(theaterRes.data);
    } catch (err) {
      console.error("Failed to load data:", err);
      setError("Error loading movies or theaters.");
    }
  };

  const handleChange = (field) => (event) => {
    setShowtimeData({ ...showtimeData, [field]: event.target.value });
  };

  const handleCreateShowtime = async () => {
    setSuccess(null);
    setError(null);

    const { movieId, theaterId, showtime, price, screenNumber } = showtimeData;

    if (!movieId || !theaterId || !showtime || !price || !screenNumber) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      await axiosInstance.post(`${BASE_URL}/movie-catalog-service/api/v1/showtimes`, {
        // ...showtimeData,
        price: Number(price),
        screenNumber: Number(screenNumber),
      });
      setSuccess("Showtime created successfully!");
      setShowtimeData({
        movieId: "",
        theaterId: "",
        showtime: "",
        price: "",
        screenNumber: "",
        availableSeats: 300,
      });
    } catch (err) {
      console.error("Error creating showtime:", err);
      setError(
        err?.response?.data?.message ||
          "Failed to create showtime. Please try again."
      );
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 600,
        mx: "auto",
        mt: 4,
        p: 3,
        background: "#fff",
        borderRadius: 3,
        boxShadow: 2,
      }}
    >
      <Typography variant="h5" mb={2}>
        Create Showtime
      </Typography>

      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TextField
        select
        label="Select Movie"
        value={showtimeData.movieId}
        onChange={handleChange("movieId")}
        fullWidth
        margin="normal"
        required
      >
        {movies.map((movie) => (
          <MenuItem key={movie.id} value={movie.id}>
            {movie.title}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        label="Select Theater"
        value={showtimeData.theaterId}
        onChange={handleChange("theaterId")}
        fullWidth
        margin="normal"
        required
      >
        {theaters.map((theater) => (
          <MenuItem key={theater.id} value={theater.id}>
            {theater.name} - {theater.city}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        label="Showtime"
        type="datetime-local"
        value={showtimeData.showtime}
        onChange={handleChange("showtime")}
        InputLabelProps={{ shrink: true }}
        fullWidth
        margin="normal"
        required
      />

      <TextField
        label="Price"
        type="number"
        value={showtimeData.price}
        onChange={handleChange("price")}
        fullWidth
        margin="normal"
        required
      />

      <TextField
        label="Screen Number"
        type="number"
        value={showtimeData.screenNumber}
        onChange={handleChange("screenNumber")}
        fullWidth
        margin="normal"
        required
      />

      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{
          mt: 2,
          "&:hover": {
            color: "white",
            backgroundColor: "grey",
          },
        }}
        onClick={handleCreateShowtime}
      >
        Create Showtime
      </Button>
    </Box>
  );
};

export default ShowtimeManagement;
