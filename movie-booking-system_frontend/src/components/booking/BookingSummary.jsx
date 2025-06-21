import React from "react";
import { useBooking } from "../../context/BookingContext";
import { Button, Typography, List, ListItem } from "@mui/material";
import { useNavigate } from "react-router-dom";

const BookingSummary = () => {
  const { selectedShowtime, selectedSeats, setBookingDetails } = useBooking();
  const navigate = useNavigate();

  const handleConfirm = () => {
    setBookingDetails({
      showtime: selectedShowtime,
      seats: selectedSeats,
      total: selectedSeats.length * 200, // ₹200 per seat
    });
    navigate("/payment");
  };

  return (
    <>
      <Typography variant="h5">Booking Summary</Typography>
      <List>
        <ListItem>Movie: {selectedShowtime?.movieTitle}</ListItem>
        <ListItem>Theater: {selectedShowtime?.theaterName}</ListItem>
        <ListItem>Time: {selectedShowtime?.startTime}</ListItem>
        <ListItem>Seats: {selectedSeats.join(", ")}</ListItem>
        <ListItem>Total Price: ₹{selectedSeats.length * 200}</ListItem>
      </List>
      <Button variant="contained" onClick={handleConfirm}>
        Proceed to Payment
      </Button>
    </>
  );
};

export default BookingSummary;
