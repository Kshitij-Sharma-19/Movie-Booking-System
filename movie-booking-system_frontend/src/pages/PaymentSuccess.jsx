import React from "react";
import { Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  return (
    <>
      <Typography variant="h4" gutterBottom>🎉 Payment Successful!</Typography>
      <Typography>Your booking is confirmed.</Typography>
      <Button onClick={() => navigate("/")} variant="contained" sx={{ mt: 2 }}>
        Go to Home
      </Button>
    </>
  );
};

export default PaymentSuccess;
