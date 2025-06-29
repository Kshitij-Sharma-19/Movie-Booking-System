import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Grid,
  Chip,
  Button,
  Stack,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { getUserBookingHistory, cancelBooking } from "../../services/bookingService";

const BookingHistory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const firstName = location.state?.firstName || "User";

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await getUserBookingHistory();
        setBookings(res.data);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    setActionLoading((prev) => ({ ...prev, [bookingId]: true }));
    try {
      await cancelBooking(bookingId);
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: "CANCELLED" } : b))
      );
    } catch {
      alert("Failed to cancel booking. Please try again.");
    } finally {
      setActionLoading((prev) => ({ ...prev, [bookingId]: false }));
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={4} sx={{ maxWidth: "1200px", margin: "auto" }}>
      <Typography variant="h4" gutterBottom textAlign="center">
        {firstName}'s Booking History
      </Typography>

      {bookings.length === 0 ? (
        <Typography>No bookings found.</Typography>
      ) : (
        <Grid container spacing={4} justifyContent="center" alignItems="stretch" sx={{ mt: 3 }}>
          {bookings.map((booking) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={booking.id}>
              <Paper
                elevation={4}
                sx={{
                  p: 3,
                  minWidth: 270,
                  maxWidth: 320,
                  borderRadius: 3,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  height: "100%",
                }}
              >
                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    {booking.movieTitle}
                  </Typography>
                  <Typography variant="body2" mt={1}>
                    🎟️ Seats: {booking.selectedSeats.join(", ")}
                  </Typography>
                  <Typography variant="body2">🏢 {booking.theaterName}</Typography>
                  <Typography variant="body2">
                    🕒{" "}
                    {new Date(booking.showtimeDateTime).toLocaleString("en-IN", {
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true,
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </Typography>
                  <Typography variant="body2">💰 ₹{booking.totalPrice}</Typography>
                </Box>

                <Stack gap={1} mt={3}>
                  <Chip
                    label={booking.status.replace("_", " ")}
                    size="small"
                    clickable
                    onClick={(e) => e.preventDefault()}
                    sx={{
                      fontWeight: 600,
                      fontSize: 14,
                      borderRadius: 2,
                      px: 1.5,
                      py: 0.5,
                      alignSelf: "flex-start",
                      marginLeft: booking.status === "PENDING_PAYMENT"
                          ? "2rem" : "0",
                      backgroundColor:
                        booking.status === "PENDING_PAYMENT"
                          ? "#ff9800"
                          : booking.status === "CONFIRMED"
                          ? "#388e3c"
                          : booking.status === "CANCELLED" || booking.status === "PAYMENT_FAILED"
                          ? "#d32f2f"
                          : "#757575",
                      color: "#fff",
                      letterSpacing: 0.5,
                      mb:
                        booking.status === "PENDING_PAYMENT" ||
                        booking.status === "PAYMENT_FAILED"
                          ? 1
                          : 0,
                      boxShadow: "none",
                    }}
                  />
                  {(booking.status === "PENDING_PAYMENT" ||
                    booking.status === "PAYMENT_FAILED") && (
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      sx={{
                        fontWeight: 700,
                        borderRadius: 2,
                        px: 3,
                        alignSelf: "center",
                        "&:hover":{
                          backgroundColor: "darkred",
                        },
                      }}
                      disabled={actionLoading[booking.id]}
                      onClick={() => handleCancel(booking.id)}
                    >
                      {actionLoading[booking.id] ? (
                        <CircularProgress size={18} color="inherit" />
                      ) : (
                        "Cancel"
                      )}
                    </Button>
                  )}
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default BookingHistory;
