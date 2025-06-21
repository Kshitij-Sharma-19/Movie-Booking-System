import React from "react";
import { Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const BookingConfirmation = () => {
  const navigate = useNavigate();
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Booking Confirmed ✅
      </Typography>
      <Typography>Your seats have been successfully booked!</Typography>
      <Button onClick={() => navigate("/")} sx={{ mt: 2 }} variant="contained">
        Go to Home
      </Button>
    </div>
  );
};

export default BookingConfirmation;
