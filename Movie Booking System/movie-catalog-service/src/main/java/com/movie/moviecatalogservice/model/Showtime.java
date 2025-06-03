package com.movie.moviecatalogservice.model;

import jakarta.persistence.*;
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
@Entity
@Table(name = "showtimes")
public class Showtime {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Movie cannot be null")
    @ManyToOne(fetch = FetchType.LAZY) // Lazy fetch is often preferred
    @JoinColumn(name = "movie_id", nullable = false)
    private Movie movie;

    @NotNull(message = "Theater cannot be null")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "theater_id", nullable = false)
    private Theater theater;

    @NotNull(message = "Showtime cannot be null")
    @Future(message = "Showtime must be in the future")
    @Column(nullable = false)
    private LocalDateTime showtime;

    @NotNull(message = "Price cannot be null")
    @Positive(message = "Price must be positive")
    @Column(nullable = false)
    private BigDecimal price;

    @Positive(message = "Available seats must be positive or zero")
    @Column(nullable = false)
    private Integer availableSeats; // Simple tracking, could be more complex

    @NotBlank(message = "Screen number cannot be blank")
    @Column(nullable = false)
    private String screenNumber; 
}