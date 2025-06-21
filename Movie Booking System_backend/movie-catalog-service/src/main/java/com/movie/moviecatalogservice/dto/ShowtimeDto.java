package com.movie.moviecatalogservice.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShowtimeDto {
    private Long id;

    @NotNull(message = "Movie ID cannot be null")
    private Long movieId; // Use IDs in DTOs

    @NotNull(message = "Theater ID cannot be null")
    private Long theaterId; // Use IDs in DTOs

    @NotNull(message = "Showtime cannot be null")
    @Future(message = "Showtime must be in the future")
    private LocalDateTime showtime;

    @NotNull(message = "Price cannot be null")
    @Positive(message = "Price must be positive")
    private BigDecimal price;

    @Positive(message = "Available seats must be positive or zero")
    private Integer availableSeats;
    
    @NotBlank(message = "Screen number cannot be blank")
    private String screenNumber;

    // Optionally include nested MovieDto/TheaterDto in response
    private MovieDto movie;
    private TheaterDto theater;
}