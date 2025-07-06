import React from "react";
import { Typography, Button, Box, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import MovieIcon from "@mui/icons-material/Movie";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import StarIcon from "@mui/icons-material/Star";
import logo from '../assets/images/logo.png'; // Adjust the path as necessary
const Home = () => (
  <Box
    align="center"
    sx={{
      marginTop: "40px",
      paddingBottom: "24px",
      minHeight: "80vh",
      flex: 1,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      borderRadius: 2,
      boxShadow: 3,
      px: 3,
    }}
  >
    {/* <MovieIcon color="primary" sx={{ fontSize: 70, mb: 1 }} /> */}
     <img
      src={logo}
      alt="CineShowtime Logo"
      style={{ height: "100px", marginBottom: "20px" , marginTop:"20px",backgroundColor:"primary"}}/>
    <Typography variant="h3" fontWeight="bold" gutterBottom>
      Welcome to CineShowtime!
    </Typography>
   
    <Typography variant="h6" color="text.secondary" mb={3}>
      Discover, book and enjoy the latest movies at your favorite theaters!
    </Typography>

    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={4}>
      <Button
        variant="contained"
        size="large"
        color="primary"
        startIcon={<EventSeatIcon />}
        component={Link}
        to="/movies"
          sx={{
          "&:hover": {
          color: "white",
    }
  }}
      >
        Book Tickets
      </Button>
      {/* <Button
        variant="outlined"
        size="large"
        color="primary"
        startIcon={<StarIcon />}
        component={Link}
        to="/reviews"
      >
        Read Reviews
      </Button> */}
    </Stack>

    <Typography variant="subtitle2" color="text.secondary" mb={1}>
      How it works:
    </Typography>
    <Box
      sx={{
        maxWidth: 600,
        textAlign: "left",
        background: "#fff",
        borderRadius: 2,
        p: 3,
        boxShadow: 1,
      }}
    >
      <Typography variant="body1" gutterBottom>
        1. <b>Browse Movies</b>: Check out currently running and upcoming movies.
      </Typography>
      <Typography variant="body1" gutterBottom>
        2. <b>Select Showtime</b>: Pick your preferred time and theater.
      </Typography>
      <Typography variant="body1" gutterBottom>
        3. <b>Book Your Seats</b>: Choose your seats and confirm your booking.
      </Typography>
       <Typography variant="body1" gutterBottom>
        4. <b>Get tickets through Email</b>📧
      </Typography>
      <Typography variant="body1" gutterBottom>
        5. <b>Enjoy the Show!</b> 🎬
      </Typography>
    </Box>
  </Box>
);

export default Home;