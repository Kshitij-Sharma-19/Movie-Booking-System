package com.movie.moviecatalogservice.dto;

import jakarta.validation.constraints.NotBlank;
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

    @Positive
    private Integer totalSeats;
}
