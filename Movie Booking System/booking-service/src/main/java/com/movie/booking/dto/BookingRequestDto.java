package com.movie.booking.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingRequestDto {

    @NotNull(message = "Showtime ID cannot be null")
    private Long showtimeId;

    @NotNull(message = "Number of seats cannot be null")
    @Positive(message = "Number of seats must be positive")
    private Integer numberOfSeats;

    // userId will be extracted from the JWT token in the controller/service
}