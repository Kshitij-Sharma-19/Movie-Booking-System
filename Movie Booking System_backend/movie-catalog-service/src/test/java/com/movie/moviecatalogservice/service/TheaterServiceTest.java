package com.movie.moviecatalogservice.service;

import com.movie.moviecatalogservice.dto.TheaterDto;
import com.movie.moviecatalogservice.exception.ResourceNotFoundException;
import com.movie.moviecatalogservice.model.Theater;
import com.movie.moviecatalogservice.repository.TheaterRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class TheaterServiceTest {

    @Mock
    private TheaterRepository theaterRepository;

    @InjectMocks
    private TheaterService theaterService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetTheaterById_Success() {
        // Arrange
        Long theaterId = 1L;
        Theater theater = new Theater();
        theater.setId(theaterId);
        theater.setName("Test Theater");
        when(theaterRepository.findById(theaterId)).thenReturn(Optional.of(theater));

        // Act
        TheaterDto result = theaterService.getTheaterById(theaterId);

        // Assert
        assertNotNull(result);
        assertEquals(theaterId, result.getId());
        assertEquals("Test Theater", result.getName());
        verify(theaterRepository, times(1)).findById(theaterId);
    }

    @Test
    void testGetTheaterById_NotFound() {
        // Arrange
        Long theaterId = 1L;
        when(theaterRepository.findById(theaterId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> theaterService.getTheaterById(theaterId));
        verify(theaterRepository, times(1)).findById(theaterId);
    }

    @Test
    void testAddTheater_Success() {
        // Arrange
        TheaterDto theaterDto = new TheaterDto();
        theaterDto.setName("New Theater");
        Theater theater = new Theater();
        theater.setName("New Theater");
        when(theaterRepository.save(any(Theater.class))).thenReturn(theater);

        // Act
        TheaterDto result = theaterService.addTheater(theaterDto);

        // Assert
        assertNotNull(result);
        assertEquals("New Theater", result.getName());
        verify(theaterRepository, times(1)).save(any(Theater.class));
    }

    @Test
    void testUpdateTheater_Success() {
        // Arrange
        Long theaterId = 1L;
        TheaterDto theaterDto = new TheaterDto();
        theaterDto.setName("Updated Theater");
        Theater theater = new Theater();
        theater.setId(theaterId);
        theater.setName("Old Theater");
        when(theaterRepository.findById(theaterId)).thenReturn(Optional.of(theater));
        when(theaterRepository.save(any(Theater.class))).thenReturn(theater);

        // Act
        TheaterDto result = theaterService.updateTheater(theaterId, theaterDto);

        // Assert
        assertNotNull(result);
        assertEquals("Updated Theater", result.getName());
        verify(theaterRepository, times(1)).findById(theaterId);
        verify(theaterRepository, times(1)).save(any(Theater.class));
    }
}
