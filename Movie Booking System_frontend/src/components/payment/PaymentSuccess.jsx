import React, { useEffect, useState, useRef } from "react";
import { Box, Typography, Alert, Button } from "@mui/material";
import { useSearchParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../services/axiosInstance";
import LoadingSpinner from "../common/LoadingSpinner";
import { useNotify } from "../../context/NotificationContext";

const BASE_URL = "http://localhost:8080"; // Change to your backend base URL

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { notifySuccess, notifyError } = useNotify();
  const bookingId = searchParams.get("booking_id");
   const hasNotifiedRef = useRef(false);
  
  useEffect(() => {
    if (!bookingId) {
      setError("No booking_id found in URL.");
      setLoading(false);
      return;
    }

    const fetchBooking = async () => {
      try {
        const res = await axiosInstance.get(
          `${BASE_URL}/booking-service/api/v1/bookings/${bookingId}`
        );
        setBooking(res.data);

        if (res.data.status === "CONFIRMED") {
          setTimeout(() => setLoading(false), 1000); // Delay to improve UX
          if (!hasNotifiedRef.current) {
          notifySuccess("Payment successful! Booking confirmed. Tickets sent to your email.");
          // notifySuccess("Check your email for ticket details.");
          hasNotifiedRef.current = true;
          } 
        } else {
          setTimeout(fetchBooking, 2000); // Poll again after 2 seconds
        }
      } catch (err) {
        console.error(err);
        notifyError("Failed to fetch payment details.");
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  if (loading)
    return (
      <LoadingSpinner message="Getting Payment Confirmation..." />
    );

  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box mt={8} textAlign="center">
      <Typography variant="h4" color="success.main" gutterBottom>
        Payment Successful!
      </Typography>
      <Typography variant="h6">
        Your booking is confirmed. <br />
        Tickets have been sent to your mail address.
      </Typography>
      <Typography mt={3}>
        Booking ID: <b>{booking.id}</b> <br />
        Movie: <b>{booking.movieTitle}</b> <br />
        Theater: <b>{booking.theaterName}</b> <br />
        Showtime:{" "}
        <b>
          {new Date(booking.showtimeDateTime).toLocaleString("en-IN", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </b>{" "}
        <br />
        Seat(s): <b>{booking.selectedSeats.join(", ")}</b> <br />
        Status: <b>{booking.status}</b>
      </Typography>
      <Button
        sx={{
          mt: 4,
          backgroundColor: "#1976d2",
          color: "#fff",
          "&:hover": {
            backgroundColor: "#115293",
          },
        }}
        variant="contained"
        onClick={() => navigate("/")}
      >
        Go Back to Home
      </Button>
    </Box>
  );
};

export default PaymentSuccess;