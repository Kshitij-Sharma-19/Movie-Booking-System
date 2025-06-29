import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const PaymentCancel = () => {
  const navigate = useNavigate();

  return (
    <Box mt={8} textAlign="center" minHeight={"100vh"}>
      <Typography variant="h4" color="error.main" gutterBottom>
        Payment Cancelled
      </Typography>
      <Typography variant="h6">
        Your payment was not completed. You can try booking again.
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

export default PaymentCancel;