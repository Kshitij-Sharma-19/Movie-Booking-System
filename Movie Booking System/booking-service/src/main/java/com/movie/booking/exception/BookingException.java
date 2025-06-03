package com.movie.booking.exception;

import lombok.Getter;

//Custom exception for booking-specific errors
@Getter
public class BookingException extends RuntimeException {
 private final Long bookingId; // Optional: Include booking ID if relevant

 public BookingException(String message, Long bookingId) {
     super(message);
     this.bookingId = bookingId;
 }

  public BookingException(String message, Long bookingId, Throwable cause) {
     super(message, cause);
     this.bookingId = bookingId;
 }
}