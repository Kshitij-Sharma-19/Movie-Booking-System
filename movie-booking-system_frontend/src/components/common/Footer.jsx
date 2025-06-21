import React from "react";
import { Typography, Box } from "@mui/material";

const Footer = () => {
  return (
    <Box className="translucent-text-container" sx={{ textAlign: "center", fontSize:"22rem", py: 3, mt: 4, borderTop: "1px solid #ccc", width: "100%"}}>
      <Typography variant="body2" color="text.secondary">
        &copy; {new Date().getFullYear()} Movie Booking System. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
