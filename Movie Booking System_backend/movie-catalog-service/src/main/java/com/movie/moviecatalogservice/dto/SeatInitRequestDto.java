package com.movie.moviecatalogservice.dto;

// Using jakarta.validation if available, otherwise remove or use javax.validation
// For simplicity, I'm omitting validation annotations here as this DTO is for internal call.
// The booking-service will perform its own validation.
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SeatInitRequestDto {
    private Integer totalSeats;
    private Integer seatsPerRow;
}