package com.movie.booking.model;

public enum BookingStatus {
    PENDING_PAYMENT, // Initial state before payment attempt
    CONFIRMED,       // Payment successful, seats reserved
    PAYMENT_FAILED,  // Payment attempt failed
    CANCELLED,       // Booking cancelled by user or system
    SHOWTIME_PASSED  // Showtime has occurred
}