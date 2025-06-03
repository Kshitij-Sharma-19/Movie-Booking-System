package com.movie.booking.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SeatInitRequestDto {

    @NotNull(message = "Total seats cannot be null")
    @Min(value = 1, message = "Total seats must be at least 1")
    private Integer totalSeats;

    @Min(value = 1, message = "Seats per row must be at least 1 if provided")
    private Integer seatsPerRow; // Optional, service will use default if null
}