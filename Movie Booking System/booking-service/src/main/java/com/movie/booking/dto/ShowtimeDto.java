package com.movie.booking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

// Simplified DTO for receiving Showtime info from Movie Catalog Service
// Only include fields needed by Booking Service
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShowtimeDto {
    private Long id;
    private Long movieId;
    private Long theaterId;
    private LocalDateTime showtime;
    private BigDecimal price;
    private Integer availableSeats;
    // Include nested Movie/Theater info if needed for denormalization
    private MovieDto movie;
    private TheaterDto theater;

    // Nested DTOs (can be simplified further if only names/titles are needed)
    @Data @NoArgsConstructor @AllArgsConstructor @Builder public static class MovieDto { private Long id; private String title; }
    @Data @NoArgsConstructor @AllArgsConstructor @Builder public static class TheaterDto { private Long id; private String name; }
}