package com.movie.moviecatalogservice.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

// Simple Theater entity for now
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "theaters")
public class Theater {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String name;

    @NotBlank
    private String city;

    private String address;

    @Positive
    private Integer totalSeats; // Total capacity, could be more complex with screen entities

    @NotNull(message = "Number of screens cannot be null")
    @Min(value = 1, message = "Theater must have at least 1 screen")
    private Integer numberOfScreens; // New field
}