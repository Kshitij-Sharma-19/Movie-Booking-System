
import React, { useEffect, useState } from "react";
import { useBooking } from "../../context/BookingContext";
import { useNavigate, useLocation } from "react-router-dom";
import { getShowtimeById } from "../../services/movieService";
import { getAvailableSeats, confirmBooking } from "../../services/bookingService";
import {
  Box,
  Typography,
  Divider,
  Paper,
  CircularProgress,
  Button
} from "@mui/material";

const BookingSummary = () => {
  const { selectedShowtime, selectedSeats } = useBooking();
  const [showtimeData, setShowtimeData] = useState(null);
  const [availableSeats, setAvailableSeats] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Support navigation from BookingHistory (retry payment)
  const bookingFromHistory = location.state?.booking;

  // Use context if not from history, else use booking details from history
  const showtimeId = bookingFromHistory?.showtimeId || selectedShowtime?.showtimeId;
  const seats = bookingFromHistory?.selectedSeats || selectedSeats;

  useEffect(() => {
    if (!showtimeId || !seats || seats.length === 0) {
      navigate("/"); // Redirect back if info is missing
      return;
    }

    getShowtimeById(showtimeId)
      .then((res) => setShowtimeData(res.data))
      .catch((err) => {
        console.error("Failed to load showtime:", err);
        navigate("/");
      });

    getAvailableSeats(showtimeId)
      .then((res) => setAvailableSeats(res.data))
      .catch((err) => {
        console.error("Failed to load seat info:", err);
        setAvailableSeats([]);
      });
  }, [showtimeId, seats, navigate]);

  if (!showtimeData) {
    return (
      <Box textAlign="center" mt={6}>
        <CircularProgress />
        <Typography mt={2}>Loading booking summary...</Typography>
      </Box>
    );
  }

  const { movie, theater, price, showtime } = showtimeData;
  const totalPrice = price * seats.length;

  // Always get seatIdentifiers, no matter if "seats" contains IDs or names
  const selectedSeatIdentifiers = seats.map(sel => {
    // If already a string, assume identifier
    if (typeof sel === "string") return sel;
    // Else, find in availableSeats by ID
    const found = availableSeats.find(seat => seat.id === sel);
    return found ? found.seatIdentifier : sel;
  }).filter(Boolean);

  const selectedSeatNames = selectedSeatIdentifiers.join(", ");

  const handleConfirmBooking = async () => {
    setLoading(true);
    try {
      const bookingData = {
        showtimeId,
        selectedSeats: selectedSeatIdentifiers,
        numberOfSeats: selectedSeatIdentifiers.length
      };
      const res = await confirmBooking(bookingData);
      const booking = res.data;
      navigate("/booking/confirmed", { state: { booking } });
    } catch (err) {
      console.error("Booking failed:", err);
      // Optionally show error UI here
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={4} sx={{ p: 4, mt: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Booking Summary
      </Typography>

      <Box
        display="flex"
        flexDirection={{ xs: "column", md: "row" }}
        gap={4}
        alignItems="flex-start"
        mt={2}
      >
        {/* Movie Poster */}
        <Box
          component="img"
          src={movie.posterUrl}
          alt={movie.title}
          sx={{
            width: 240,
            height: 340,
            borderRadius: 2,
            objectFit: "cover",
            boxShadow: 3,
          }}
        />

        {/* Details */}
        <Box flex="1">
          <Typography variant="h5">{movie.title}</Typography>
          <Typography variant="subtitle1" color="text.secondary" mb={1}>
            {theater.name}, {theater.address}
          </Typography>
          <Typography variant="body2" mb={2}>
            Showtime:  {new Date(showtime).toLocaleString("en-IN", {
              hour: "numeric",
              minute: "numeric",
              hour12: true,
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </Typography>

          <Typography variant="h6">Selected Seats:</Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            {selectedSeatNames}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6">
            Price per Seat: ₹{price?.toFixed(2)}
          </Typography>
          <Typography variant="h6">
            Total: ₹{totalPrice}
          </Typography>

          <Button
            variant="contained"
            color="success"
            sx={{
              mt: 3,
              backgroundColor: "green",
              color: "#fff",
              "&:hover": { backgroundColor: "darkgreen" }
            }}
            onClick={handleConfirmBooking}
            disabled={loading}
          >
            {loading ? "Processing..." : "Confirm Booking"}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default BookingSummary;