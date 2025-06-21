package com.movie.moviecatalogservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

// DTO for Movie requests/responses
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MovieDto {
    private Long id; // Include ID in responses

    @NotBlank(message = "Title cannot be blank")
    private String title;

    private String description;
    private String genre;

    @Positive(message = "Duration must be positive")
    private Integer durationMinutes;

    private LocalDate releaseDate;
    private String director;
    private String castMembers;
    private String posterUrl;
}