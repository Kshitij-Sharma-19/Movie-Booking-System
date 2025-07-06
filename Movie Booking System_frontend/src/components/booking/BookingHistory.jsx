import React, { useEffect, useState, useRef } from "react";
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
import { useNavigate } from "react-router-dom";
import { getUserBookingHistory, cancelBooking } from "../../services/bookingService";
import { useUserProfileContext } from "../../context/UserProfileContext";
import { useBooking } from "../../context/BookingContext";
import { confirmBookingWithPayment } from "../../services/bookingService";
import { useNotify } from "../../context/NotificationContext";

const BookingHistory = () => {
  const navigate = useNavigate();
  const {notifySuccess, notifyError } = useNotify();
  const hasNotifiedRef = useRef(false);

  const { profile, setProfile } = useUserProfileContext();
  const firstName = profile?.firstName || "User";
  const { setBookingDetails, setSelectedShowtime, setSelectedSeats } = useBooking();
  
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await getUserBookingHistory();
        setBookings(res.data);
         if (!hasNotifiedRef.current) {
          notifySuccess("Booking history fetched successfully!");
          hasNotifiedRef.current = true;
        }
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
        notifyError("Failed to fetch booking history. Please try again later.");
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
      notifySuccess("Booking cancelled successfully!");
    } catch {
      notifyError("Failed to cancel booking. Please try again.");
    } finally {
      setActionLoading((prev) => ({ ...prev, [bookingId]: false }));
    }
  };
  
const handleConfirmAndPay = async (booking) => {
  setActionLoading((prev) => ({ ...prev, [booking.id]: true }));
  try {
    const res = await confirmBookingWithPayment(booking.id);
    const updatedBooking = {
      ...booking,
      redirectUrl: res.data.redirectUrl,
    };
    notifySuccess("Booking confirmed! Proceed with payment...");

    navigate("/booking/confirmed", { state: { booking: updatedBooking } });
  } catch (error) {
    console.error("Failed to confirm booking:", error);
    notifyError("Failed to confirm booking. Please try again.");
    //alert("Something went wrong. Please try again.");
  } finally {
    setActionLoading((prev) => ({ ...prev, [booking.id]: false }));
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
    <Box p={{ xs: 2, sm: 4 }} sx={{ maxWidth: "1200px", margin: "auto" }}>
      <Typography variant="h4" gutterBottom textAlign="center" fontWeight={600}>
        {firstName}'s Booking History
      </Typography>

      {bookings.length === 0 ? (
        <Typography textAlign="center" mt={3}>No bookings found.</Typography>
      ) : (
        <Grid
  container
  spacing={3}
  justifyContent="center"
  alignItems="stretch"
  sx={{ mt: 2 }}
>
  {bookings.map((booking) => (
    <Grid item xs={12} sm={6} md={4} key={booking.id}>
      <Paper
        elevation={4}
        sx={{
          p: 3,
          borderRadius: 3,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: { xs: "auto", sm: 270 },
          boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
          transition: "transform 0.2s ease-in-out",
          "&:hover": {
            transform: "scale(1.02)",
          },
        }}
      >
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            {booking.movieTitle}
          </Typography>
          <Typography variant="body2" gutterBottom>
            🎟️ Seats: {booking.selectedSeats.join(", ")}
          </Typography>
          <Typography variant="body2">🏢 {booking.theaterName}</Typography>
          <Typography variant="body2">
            🕒{" "}
            {new Date(booking.showtimeDateTime).toLocaleString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </Typography>
          <Typography variant="body2" mt={1}>
            💰 ₹{booking.totalPrice}
          </Typography>
        </Box>

        <Stack
          direction="column"
          spacing={1}
          mt="auto"
          alignItems="center"
          justifyContent="flex-end"
        >
          <Chip
            label={booking.status.replace("_", " ")}
            size="small"
            sx={{
              fontWeight: 600,
              fontSize: 14,
              borderRadius: 2,
              px: 1.5,
              py: 0.5,
              backgroundColor:
                booking.status === "PENDING_PAYMENT"
                  ? "#ff9800"
                  : booking.status === "CONFIRMED"
                  ? "#388e3c"
                  : booking.status === "CANCELLED" || booking.status === "PAYMENT_FAILED"
                  ? "#d32f2f"
                  : "#757575",
              color: "#fff",
              boxShadow: "none",
            }}
          />

          {(booking.status === "PENDING_PAYMENT" ||
            booking.status === "PAYMENT_FAILED") && (
            <>
    <Button
      variant="contained"
      color="success"
      size="small"
      sx={{
        fontWeight: 700,
        borderRadius: 2,
        px: 3,
        "&:hover": {
          backgroundColor: "green",
        },
      }}
      onClick={() => handleConfirmAndPay(booking)}
    >
      Confirm & Pay
    </Button>

    <Button
      variant="contained"
      color="error"
      size="small"
      sx={{
        fontWeight: 700,
        borderRadius: 2,
        px: 3,
        "&:hover": {
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
  </>
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
