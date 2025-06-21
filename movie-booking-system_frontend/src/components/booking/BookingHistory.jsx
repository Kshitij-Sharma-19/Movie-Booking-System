import React, { useEffect, useState } from "react";
import { getUserBookingHistory } from "../../services/bookingService";
import { List, ListItem, Typography } from "@mui/material";

const BookingHistory = ({ userId }) => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    getUserBookingHistory(userId).then((res) => setBookings(res.data));
  }, [userId]);

  return (
    <>
      <Typography variant="h5" mb={2}>Booking History</Typography>
      <List>
        {bookings.map((b) => (
          <ListItem key={b.id}>
            {b.movieTitle} | {b.theaterName} | Seats: {b.seats.join(", ")} | Date: {b.date}
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default BookingHistory;
