import React, { useEffect, useState } from "react";
import SeatMap from "./SeatMap";
import { useBooking } from "../../context/BookingContext";
import { Button, Typography } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { getAvailableSeats } from "../../services/bookingService";

const SeatSelector = () => {
  const { selectedShowtime, selectedSeats, setSelectedSeats } = useBooking();
  const [seats, setSeats] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const movieName = location.state?.movieName || "Movie";
  const theatreName = location.state?.theatreName || "Theatre";
  const theatreAddress = location.state?.theaterLocation || "Address";
  const showtimeId = location.state?.showtimeId;

  useEffect(() => {
    if (showtimeId) {
      getAvailableSeats(showtimeId)
        .then((res) => {
          console.log("Seat API data:", res.data); // Check for full A-Z
          setSeats(res.data);
        })
        .catch((err) => {
          // Handle error, optionally show fallback or error message
          setSeats([]);
        });
    } else {
      // Only use dummy data in development if needed!
      // Remove or comment this out for production
      // setSeats(dummySeats);
    }
  }, [showtimeId]); // <-- use showtimeId as dependency

  const handleNext = () => {
    if (selectedSeats.length === 0) return alert("Select at least one seat.");
    navigate("/booking/summary");
  };

  return (
    <>
      <Typography variant="h4" fontWeight="bold" mb={1}>
        {movieName}
      </Typography>
      <Typography variant="h6" sx={{ color: "black" }} mb={3}>
        {theatreName}, {theatreAddress}
      </Typography>
      <Typography variant="h5">Select Your Seats</Typography>
      <SeatMap
        seats={seats}
        selectedSeats={selectedSeats}
        onSelect={setSelectedSeats}
        // movieName={movieName}
        // theatreName={theatreName}
        // theatreAddress={theatreAddress}
      />
      <Button variant="contained" onClick={handleNext} sx={{ mt: 2 }}>
        Proceed to Summary
      </Button>
    </>
  );
};

export default SeatSelector;