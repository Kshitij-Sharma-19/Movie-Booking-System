package com.movie.moviecatalogservice.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
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
public class TheaterDto {
    private Long id;

    @NotBlank
    private String name;

    @NotBlank
    private String city;

    private String address;


    @NotNull(message = "Total seats cannot be null")
    @Positive
    private Integer totalSeats;

    @NotNull(message = "Number of screens cannot be null")
    @Min(value = 1, message = "Theater must have at least 1 screen")
    private Integer numberOfScreens; // New field
}
