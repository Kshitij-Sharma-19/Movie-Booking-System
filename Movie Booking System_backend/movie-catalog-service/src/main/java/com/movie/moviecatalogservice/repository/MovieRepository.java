package com.movie.moviecatalogservice.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.movie.moviecatalogservice.model.Movie;

import java.util.List;
import java.util.Optional;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> {

    // Find movies by genre (case-insensitive)
    List<Movie> findByGenreContainingIgnoreCase(String genre);

    // Find movie by title (case-insensitive)
    Optional<Movie> findByTitleIgnoreCase(String title);

    // Check if a movie exists by title (case-insensitive)
    boolean existsByTitleIgnoreCase(String title);
}