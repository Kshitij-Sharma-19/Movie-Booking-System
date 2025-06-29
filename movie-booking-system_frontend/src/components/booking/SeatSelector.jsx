import React, { useEffect, useState } from "react";
import { useBooking } from "../../context/BookingContext";
import { useNavigate, useLocation } from "react-router-dom";
import { getAvailableSeats } from "../../services/bookingService";
import { Typography, Button, Box } from "@mui/material";
import SeatMap from "./SeatMap";
import LoadingSpinner from "../common/LoadingSpinner";
const SeatSelector = () => {
  const {
    setSelectedShowtime,
    selectedSeats,
    setSelectedSeats,
  } = useBooking();

  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  const {
    movieName = "Movie",
    theatreName = "Theatre",
    theaterLocation = "Address",
    showtimeId,
    price,
    movieId,
    theaterId,
    posterUrl,
  } = location.state || {};

  useEffect(() => {
    if (!showtimeId) return;

    setLoading(true);

    // Get seats from API
    getAvailableSeats(showtimeId)
      .then((res) => {
        setSeats(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching seats:", err);
        setSeats([]);
        setLoading(false);
      });

    // Populate context
    setSelectedShowtime({
      movieId,
      showtimeId,
      theaterId,
      movieName,
      theatreName,
      theaterLocation,
      price,
      posterUrl,
    });
  }, [showtimeId]);

  const handleNext = () => {
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat.");
      return;
    }
    navigate("/booking/summary");
  };

  // If seats are not initialized or empty, display message
  if (!loading && (!seats || seats.length === 0)) {
    // console.log(posterUrl)
    return (
       <Box
    display="flex"
    flexDirection="column"
    minHeight="100vh"
    bgcolor={"#f5f5f5"}
  >
      <Box display="flex" flexDirection="column" alignItems="center" mt={4} alignContent={"center"} margin={"auto"}>
        <Typography variant="h4" fontWeight="bold" mb={1}>
          {movieName}
        </Typography>
        <img src={posterUrl} alt={movieName} style={{ width: "200px", height: "300px", marginBottom: "20px" }} />
        <Typography variant="h6" mb={2}>
          {theatreName}, {theaterLocation}
        </Typography>
        <Typography variant="h5" mb={3} color="error">
          Seats have not been initialized, Check Back later
        </Typography>
      </Box>
      </Box>
    );
  }

  return (
    <>
      <Typography variant="h4" fontWeight="bold" mb={1}>
        {movieName}
      </Typography>
      <Typography variant="h6" mb={2}>
        {theatreName}, {theaterLocation}
      </Typography>
      <Typography variant="h5" mb={2}>Select Your Seats</Typography>

      {loading ? (
        <>
        <Typography variant="body1" mb={3}>Loading seats...</Typography>
        <LoadingSpinner />
        </>
        
        
      ) : (
        <SeatMap
          seats={seats}
          selectedSeats={selectedSeats}
          onSelect={setSelectedSeats}
        />
      )}

      <Button
        variant="contained"
        onClick={handleNext}
        sx={{
          mt: 3,
          backgroundColor: "#1976d2",
          color: "#fff",
          "&:hover": {
            backgroundColor: "#115293"
          },
        }}
        disabled={loading || !seats || seats.length === 0}
      >
        Proceed to Summary
      </Button>
    </>
  );
};

export default SeatSelector;