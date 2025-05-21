package com.movie.moviecatalogservice.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "movies")
public class Movie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Title cannot be blank")
    @Column(nullable = false, unique = true) // Assuming title is unique
    private String title;

    @Lob // Use Lob for potentially long descriptions
    private String description;

    private String genre;

    @Positive(message = "Duration must be positive")
    private Integer durationMinutes; // Duration in minutes

    private LocalDate releaseDate;

    private String director;

    private String castMembers; // Simple comma-separated string, or use a separate entity/collection

    private String posterUrl;

    // Example relationship: A movie can have many showtimes
    // @OneToMany(mappedBy = "movie", cascade = CascadeType.ALL, orphanRemoval = true)
    // private List<Showtime> showtimes;
}