package com.movie.moviecatalogservice.service;

import com.movie.moviecatalogservice.dto.MovieDto;
import com.movie.moviecatalogservice.exception.ResourceNotFoundException;
import com.movie.moviecatalogservice.model.Movie;
import com.movie.moviecatalogservice.repository.MovieRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class MovieServiceTest {

    @Mock
    private MovieRepository movieRepository;

    @InjectMocks
    private MovieService movieService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetMovieById_Success() {
        // Arrange
        Long movieId = 1L;
        Movie movie = new Movie();
        movie.setId(movieId);
        movie.setTitle("Test Movie");
        when(movieRepository.findById(movieId)).thenReturn(Optional.of(movie));

        // Act
        MovieDto result = movieService.getMovieById(movieId);

        // Assert
        assertNotNull(result);
        assertEquals(movieId, result.getId());
        assertEquals("Test Movie", result.getTitle());
        verify(movieRepository, times(1)).findById(movieId);
    }

    @Test
    void testGetMovieById_NotFound() {
        // Arrange
        Long movieId = 1L;
        when(movieRepository.findById(movieId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> movieService.getMovieById(movieId));
        verify(movieRepository, times(1)).findById(movieId);
    }

    @Test
    void testAddMovie_Success() {
        // Arrange
        MovieDto movieDto = new MovieDto();
        movieDto.setTitle("New Movie");
        Movie movie = new Movie();
        movie.setTitle("New Movie");
        when(movieRepository.existsByTitleIgnoreCase(movieDto.getTitle())).thenReturn(false);
        when(movieRepository.save(any(Movie.class))).thenReturn(movie);

        // Act
        MovieDto result = movieService.addMovie(movieDto);

        // Assert
        assertNotNull(result);
        assertEquals("New Movie", result.getTitle());
        verify(movieRepository, times(1)).existsByTitleIgnoreCase(movieDto.getTitle());
        verify(movieRepository, times(1)).save(any(Movie.class));
    }

    @Test
    void testAddMovie_TitleConflict() {
        // Arrange
        MovieDto movieDto = new MovieDto();
        movieDto.setTitle("Duplicate Movie");
        when(movieRepository.existsByTitleIgnoreCase(movieDto.getTitle())).thenReturn(true);

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> movieService.addMovie(movieDto));
        verify(movieRepository, times(1)).existsByTitleIgnoreCase(movieDto.getTitle());
    }
}