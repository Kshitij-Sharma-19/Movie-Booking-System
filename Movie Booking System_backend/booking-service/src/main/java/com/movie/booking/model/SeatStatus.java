package com.movie.booking.model;

public enum SeatStatus {
    AVAILABLE,      // The seat is available for booking
    SELECTED_TEMP,  // The seat has been temporarily selected by a user but not yet part of a pending booking (e.g., during seat selection UI interaction)
    PENDING_PAYMENT,// The seat is part of a booking that is awaiting payment confirmation
    BOOKED,         // The seat has been successfully booked and paid for
    BLOCKED         // The seat is unavailable (e.g., broken, reserved for staff)
}