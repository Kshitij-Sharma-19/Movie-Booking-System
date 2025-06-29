import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useLocation } from "react-router-dom";
import { cancelBooking } from "../../services/bookingService";
const BookingConfirmation = () => {
  const location = useLocation();
  const booking = location.state?.booking;

  console.log("Booking Confirmation Data:", booking);
  if (!booking) return <Typography>Booking not found.</Typography>;

  const handleStripeRedirect = () => {
    window.location.href = booking.redirectUrl;
  };

   const handleCancelPayment = () => {
    window.location.href ="/payment/cancel";
  };


  return (
    <Box mt={10} textAlign="center">
      <Typography variant="h5" gutterBottom>
        Ready to Pay?
      </Typography>
      <Typography color="text.secondary" mb={3}>
        Your booking is ready. Click below to proceed to secure payment.
      </Typography>
      <Button
        sx={{ backgroundColor: "#1976d2", color: "#fff", mt:2,
            "&:hover": {
              backgroundColor: "#115293"
            } }}
        variant="contained"
        color="primary"
        onClick={handleStripeRedirect}
        size="large"
      >
        Proceed to Payment
      </Button>
       <Button
        sx={{ backgroundColor: "error", color: "#fff", mt:2, ml: 2,
            "&:hover": {
              backgroundColor: "darkred"
            } }}
        variant="contained"
        color="primary"
       onClick={handleCancelPayment}
        size="large"
      >
        Cancel Payment
      </Button>
    </Box>
  );
};

export default BookingConfirmation;