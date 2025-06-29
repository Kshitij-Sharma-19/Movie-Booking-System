import React, { useEffect, useState } from "react";
import { Box, Typography, Alert,Button } from "@mui/material";
import { useSearchParams,useNavigate } from "react-router-dom";
import axiosInstance from "../../services/axiosInstance";
import LoadingSpinner from "../common/LoadingSpinner";
const BASE_URL = "http://localhost:8080"; // Change to your backend base URL

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const bookingId = searchParams.get("booking_id");


  useEffect(() => {
    if (!bookingId) {
      setError("No booking_id found in URL.");
      setLoading(false);
      return;
    }
    axiosInstance
      .get(`${BASE_URL}/booking-service/api/v1/bookings/${bookingId}`)
      .then((res) => {
        setBooking(res.data);
        setTimeout(() => {
          setLoading(false);
        }, 2000); // 2000ms = 2 seconds
      })
      .catch((err) => {
        setError("Failed to fetch booking details.");
        setLoading(false);
      });
  }, [bookingId]);

  if (loading) return <LoadingSpinner/>;
  if (error) return <Alert severity="error">{error}</Alert>;
  console.log("Booking Data:", booking);

  return (
    <Box mt={8} textAlign="center">
      <Typography variant="h4" color="success.main" gutterBottom>
        Payment Successful!
      </Typography>
      <Typography variant="h6">Your booking is confirmed. <br/>Tickets have been send to your mail address</Typography>
      <Typography mt={3}>
        Booking ID: <b>{booking.id}</b> <br />
        Movie: <b>{booking.movieTitle}</b> <br />
        Theater: <b>{booking.theaterName}</b> <br />
        {/* Showtime: <b>{new Date(booking.showtimeDateTime).toLocaleString()}</b> <br /> */}
        Showtime: <b>    {new Date(booking.showtimeDateTime).toLocaleString("en-IN", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    day: "2-digit",
    month: "short",
    year: "numeric",
  })}</b> <br />
        Seat(s): <b>{booking.selectedSeats.join(", ")}</b> <br />
        Status: <b>{booking.status}</b>
      </Typography>
        <Button sx={{ mt: 4, backgroundColor: "#1976d2", color: "#fff",
            "&:hover": {
              backgroundColor: "#115293"
            }}} variant="contained" onClick={() => navigate("/")}>
        Go Back to Home
      </Button>
    </Box>
    
  );
};

export default PaymentSuccess;