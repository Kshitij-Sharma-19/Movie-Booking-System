package com.movie.moviecatalogservice.service;

import com.movie.moviecatalogservice.dto.ShowtimeDto;
import com.movie.moviecatalogservice.exception.ResourceNotFoundException;
import com.movie.moviecatalogservice.model.Movie;
import com.movie.moviecatalogservice.model.Showtime;
import com.movie.moviecatalogservice.model.Theater;
import com.movie.moviecatalogservice.repository.MovieRepository;
import com.movie.moviecatalogservice.repository.ShowtimeRepository;
import com.movie.moviecatalogservice.repository.TheaterRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ShowtimeServiceTest {

    @Mock
    private ShowtimeRepository showtimeRepository;

    @Mock
    private MovieRepository movieRepository;

    @Mock
    private TheaterRepository theaterRepository;

    @InjectMocks
    private ShowtimeService showtimeService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetShowtimeById_Success() {
        // Arrange
        Long showtimeId = 1L;
        Showtime showtime = new Showtime();
        showtime.setId(showtimeId);
        showtime.setPrice(BigDecimal.valueOf(100));
        when(showtimeRepository.findById(showtimeId)).thenReturn(Optional.of(showtime));

        // Act
        ShowtimeDto result = showtimeService.getShowtimeById(showtimeId);

        // Assert
        assertNotNull(result);
        assertEquals(showtimeId, result.getId());
        assertEquals(BigDecimal.valueOf(100), result.getPrice());
        verify(showtimeRepository, times(1)).findById(showtimeId);
    }

    @Test
    void testGetShowtimeById_NotFound() {
        // Arrange
        Long showtimeId = 1L;
        when(showtimeRepository.findById(showtimeId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> showtimeService.getShowtimeById(showtimeId));
        verify(showtimeRepository, times(1)).findById(showtimeId);
    }

    @Test
    void testAddShowtime_Success() {
        // Arrange
        ShowtimeDto showtimeDto = new ShowtimeDto();
        showtimeDto.setMovieId(1L);
        showtimeDto.setTheaterId(1L);
        showtimeDto.setPrice(BigDecimal.valueOf(100));
        showtimeDto.setScreenNumber("Screen-1");
        Movie movie = new Movie();
        movie.setId(1L);
        Theater theater = new Theater();
        theater.setId(1L);
        theater.setTotalSeats(200);
        theater.setNumberOfScreens(2);
        
        when(movieRepository.findById(1L)).thenReturn(Optional.of(movie));
        when(theaterRepository.findById(1L)).thenReturn(Optional.of(theater));
        when(showtimeRepository.save(any(Showtime.class))).thenReturn(new Showtime());

        // Act
        ShowtimeDto result = showtimeService.addShowtime(showtimeDto);

        // Assert
        assertNotNull(result);
        verify(movieRepository, times(1)).findById(1L);
        verify(theaterRepository, times(1)).findById(1L);
        verify(showtimeRepository, times(1)).save(any(Showtime.class));
    }
}