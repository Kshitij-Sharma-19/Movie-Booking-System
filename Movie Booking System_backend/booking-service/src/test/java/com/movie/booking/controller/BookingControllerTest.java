package com.movie.booking.controller;

import com.movie.booking.dto.BookingRequestDto;
import com.movie.booking.dto.BookingResponseDto;
import com.movie.booking.model.BookingStatus;
import com.movie.booking.service.BookingService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class BookingControllerTest {

    @Mock
    private BookingService bookingService;

    @InjectMocks
    private BookingController bookingController;

    @Mock
    private Jwt jwt;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        when(jwt.getSubject()).thenReturn("testUserId");
    }

    @Test
    void testCreateBooking_Success() {
        // Arrange
        BookingRequestDto requestDto = new BookingRequestDto();
        BookingResponseDto responseDto = new BookingResponseDto();
        responseDto.setStatus(BookingStatus.CONFIRMED);
        when(bookingService.createBooking(eq(requestDto), eq("testUserId"))).thenReturn(responseDto);

        // Act
        ResponseEntity<BookingResponseDto> response = bookingController.createBooking(requestDto, jwt);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(BookingStatus.CONFIRMED, response.getBody().getStatus());
        verify(bookingService, times(1)).createBooking(eq(requestDto), eq("testUserId"));
    }

    @Test
    void testGetBookingById_Success() {
        // Arrange
        Long bookingId = 1L;
        BookingResponseDto responseDto = new BookingResponseDto();
        responseDto.setId(bookingId);
        when(bookingService.getBookingById(eq(bookingId), eq("testUserId"))).thenReturn(responseDto);

        // Act
        ResponseEntity<BookingResponseDto> response = bookingController.getBookingById(bookingId, jwt);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(bookingId, response.getBody().getId());
        verify(bookingService, times(1)).getBookingById(eq(bookingId), eq("testUserId"));
    }

    @Test
    void testGetMyBookings_Success() {
        // Arrange
        BookingResponseDto booking1 = new BookingResponseDto();
        BookingResponseDto booking2 = new BookingResponseDto();
        when(bookingService.getBookingsByUserId(eq("testUserId"))).thenReturn(Arrays.asList(booking1, booking2));

        // Act
        ResponseEntity<?> response = bookingController.getMyBookings(jwt);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(2, ((List<?>) response.getBody()).size());
        verify(bookingService, times(1)).getBookingsByUserId(eq("testUserId"));
    }
}