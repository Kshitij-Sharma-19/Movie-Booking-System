package com.movie.booking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List; // Import List

import com.movie.booking.model.BookingStatus;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponseDto {
    private Long id;
    private String userId;
    private Long showtimeId;
    private Long movieId;
    private Long theaterId;
    private Integer numberOfSeats; // Derived from selectedSeats.size()
    private List<String> selectedSeats; // ADDED FIELD
    private BigDecimal totalPrice;
    private LocalDateTime bookingTime;
    private BookingStatus status;
    private String paymentTransactionId; // Optional

    // Denormalized fields for display
    private String movieTitle;
    private String theaterName;
    private LocalDateTime showtimeDateTime;
}