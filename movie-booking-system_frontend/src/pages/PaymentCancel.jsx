import React from "react";
import { Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const PaymentCancel = () => {
  const navigate = useNavigate();

  return (
    <>
      <Typography variant="h4" color="error" gutterBottom>❌ Payment Cancelled</Typography>
      <Typography>Your payment was not completed. Try again.</Typography>
      <Button onClick={() => navigate("/booking/summary")} variant="contained" sx={{ mt: 2 }}>
        Go Back
      </Button>
    </>
  );
};

export default PaymentCancel;
