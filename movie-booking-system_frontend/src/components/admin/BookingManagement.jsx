import React, { useState } from "react";
import { Typography, TextField, Button, Box, Alert } from "@mui/material";
import axiosInstance from "../../services/axiosInstance"; // Make sure this includes auth header

const BASE_URL = process.env.REACT_APP_API_BASE_URL;
const BookingManagement = () => {
  const [showtimeId, setShowtimeId] = useState("");
  const [totalSeats, setTotalSeats] = useState("");
  const [seatsPerRow, setSeatsPerRow] = useState("");
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleInitializeSeats = async () => {
    setSuccess(null);
    setError(null);
    if (!showtimeId || !totalSeats || !seatsPerRow) {
      setError("All fields are required.");
      return;
    }
    try {
      await axiosInstance.post(
        `${BASE_URL}/booking-service/api/v1/admin/showtimes/${showtimeId}/initialize-seats`,
        {
          totalSeats: Number(totalSeats),
          seatsPerRow: Number(seatsPerRow),
        }
      );
      setSuccess("Seats initialized successfully!");
      setShowtimeId("");
      setTotalSeats("");
      setSeatsPerRow("");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        "Failed to initialize seats. Please check the showtime ID."
      );
    }
  };

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", mt: 4, p: 3, background: "#fff", borderRadius: 3, boxShadow: 2 }}>
      <Typography variant="h5" mb={2}>
        Initialize Seats for Showtime
      </Typography>
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <TextField
        label="Showtime ID"
        value={showtimeId}
        onChange={e => setShowtimeId(e.target.value)}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Total Seats"
        type="number"
        value={totalSeats}
        onChange={e => setTotalSeats(e.target.value)}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Seats Per Row"
        type="number"
        value={seatsPerRow}
        onChange={e => setSeatsPerRow(e.target.value)}
        fullWidth
        margin="normal"
        required
      />
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2 ,"&:hover": {
            color: "white", backgroundColor:"grey"
          }, }}
        fullWidth
        onClick={handleInitializeSeats}
      >
        Initialize Seats
      </Button>
    </Box>
  );
};

export default BookingManagement;