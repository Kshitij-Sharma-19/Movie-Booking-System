import React, { useState } from "react";
import {
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { deinitializeSeatsForShowtime } from "../../services/bookingService";
import axiosInstance from "../../services/axiosInstance";
import { green, grey } from "@mui/material/colors";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const BookingManagement = () => {
  const [showtimeId, setShowtimeId] = useState("");
  const [totalSeats, setTotalSeats] = useState("");
  const [seatsPerRow, setSeatsPerRow] = useState("");
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  // For deinitialize
  const [deinitShowtimeId, setDeinitShowtimeId] = useState("");
  const [deinitSuccess, setDeinitSuccess] = useState(null);
  const [deinitError, setDeinitError] = useState(null);

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

  // Use the service method for deinitialize
  const handleDeinitializeSeats = async () => {
    setDeinitSuccess(null);
    setDeinitError(null);
    if (!deinitShowtimeId) {
      setDeinitError("Showtime ID is required.");
      return;
    }
    try {
      await deinitializeSeatsForShowtime(deinitShowtimeId);
      setDeinitSuccess("Seats deinitialized successfully!");
      setDeinitShowtimeId("");
    } catch (err) {
      setDeinitError(
        err?.response?.data?.message ||
          "Failed to deinitialize seats. Please check the showtime ID."
      );
    }
  };

  return (
    <Box
      sx={{
        minHeight: "70vh", // Ensure the page remains tall
        maxWidth: 500,
        mx: "auto",
        mt: 4,
        p: 3,
        background: "#fff",
        borderRadius: 3,
        boxShadow: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
      }}
    >
    <Typography
        variant="h4"
        align="center"
        sx={{
          mb: 4,
          letterSpacing: 2,
          fontWeight: 700,
          color: grey[900],
        }}
      >
        Booking Management
      </Typography>
      {/* Initialize Seats */}
      <Accordion defaultExpanded sx={{ mb: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Initialize Seats for Showtime</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            label="Showtime ID"
            value={showtimeId}
            onChange={(e) => setShowtimeId(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Total Seats"
            type="number"
            value={totalSeats}
            onChange={(e) => setTotalSeats(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Seats Per Row"
            type="number"
            value={seatsPerRow}
            onChange={(e) => setSeatsPerRow(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <Button
            variant="contained"
            color="primary"
            sx={{
              mt: 2,
              "&:hover": {
                color: "white",
                backgroundColor: "grey",
              },
            }}
            fullWidth
            onClick={handleInitializeSeats}
          >
            Initialize Seats
          </Button>
        </AccordionDetails>
      </Accordion>

      {/* Deinitialize Seats */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" color="error">
            Deinitialize Seats for Showtime
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {deinitSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {deinitSuccess}
            </Alert>
          )}
          {deinitError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {deinitError}
            </Alert>
          )}
          <TextField
            label="Showtime ID"
            value={deinitShowtimeId}
            onChange={(e) => setDeinitShowtimeId(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <Button
            variant="contained"
            color="error"
            sx={{
              mt: 2,
              fontWeight: 600,
              "&:hover": {
                backgroundColor: "#c62828",
              },
            }}
            fullWidth
            onClick={handleDeinitializeSeats}
          >
            Deinitialize Seats
          </Button>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default BookingManagement;