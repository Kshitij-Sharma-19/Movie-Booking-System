import React from "react";
import { Box, Typography, Container, Paper } from "@mui/material";

const AboutUs = () => {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper
        elevation={4}
        sx={{
          p: { xs: 3, sm: 5 },
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          borderRadius: 4,
        }}
      >
        <Typography
          variant="h3"
          gutterBottom
          sx={{
            fontWeight: 700,
            color: "#2d3142",
            textAlign: "center",
            mb: 3,
            letterSpacing: 1,
          }}
        >
          About Us
        </Typography>
        <Typography
          variant="body1"
          sx={{
            mb: 2,
            color: "#4f5d75",
            fontSize: "1.15rem",
            textAlign: "center",
          }}
        >
          Welcome to CineShowtime – your ultimate destination for all things movies! Whether you’re a casual viewer or a passionate cinephile, we’re here to make your movie-going experience seamless and enjoyable.
        </Typography>
        <Typography
          variant="body1"
          sx={{
            mb: 2,
            color: "#4f5d75",
            fontSize: "1.15rem",
            textAlign: "center",
          }}
        >
          <b>Our Mission:</b> To connect movie lovers with the latest films, showtimes, and reviews, while providing a platform to share your own cinema moments and opinions.
        </Typography>
        <Typography
          variant="body1"
          sx={{
            mb: 2,
            color: "#4f5d75",
            fontSize: "1.15rem",
            textAlign: "center",
          }}
        >
          <b>What We Offer:</b>
          <ul style={{ textAlign: "left", margin: "16px auto", maxWidth: 600 }}>
            <li>Up-to-date movie listings and showtimes for theaters near you</li>
            <li>Easy online ticket booking</li>
            <li>Detailed movie information, trailers, and reviews</li>

          </ul>
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "#4f5d75",
            fontSize: "1.15rem",
            textAlign: "center",
          }}
        >
          Thank you for choosing CineShowtime. Let’s make every movie night memorable!
        </Typography>
      </Paper>
    </Container>
  );
};

export default AboutUs;
