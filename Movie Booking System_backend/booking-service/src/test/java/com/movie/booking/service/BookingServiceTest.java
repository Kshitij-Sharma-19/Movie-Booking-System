package com.movie.booking.service;

import com.movie.booking.client.MovieCatalogClient;
import com.movie.booking.client.PaymentClient;
import com.movie.booking.dto.*;
import com.movie.booking.exception.BookingException;
import com.movie.booking.exception.ResourceNotFoundException;
import com.movie.booking.model.Booking;
import com.movie.booking.model.BookingStatus;
import com.movie.booking.model.SeatStatus;
import com.movie.booking.model.ShowtimeSeat;
import com.movie.booking.repository.BookingRepository;
import com.movie.booking.repository.ShowtimeSeatRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class BookingServiceTest {

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private ShowtimeSeatRepository showtimeSeatRepository;

    @Mock
    private MovieCatalogClient movieCatalogClient;

    @Mock
    private PaymentClient paymentClient;

    @InjectMocks
    private BookingService bookingService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

//    @Test
//    void testCreateBooking_Success() {
//        // Arrange
//        BookingRequestDto requestDto = new BookingRequestDto();
//        requestDto.setShowtimeId(1L);
//        requestDto.setNumberOfSeats(2);
//        requestDto.setSelectedSeats(List.of("A1", "A2"));
//
//        ShowtimeDto showtimeDto = new ShowtimeDto();
//        showtimeDto.setPrice(BigDecimal.valueOf(100));
//        showtimeDto.setMovieId(10L);
//        showtimeDto.setTheaterId(5L);
//        showtimeDto.setShowtime(LocalDateTime.now().plusDays(1));
//
//        when(movieCatalogClient.getShowtimeById(eq(1L)))
//            .thenReturn(ResponseEntity.ok(showtimeDto));
//
//        ShowtimeSeat seat1 = new ShowtimeSeat(1L, 1L, "A1", SeatStatus.AVAILABLE, null, null, null, null);
//        ShowtimeSeat seat2 = new ShowtimeSeat(2L, 1L, "A2", SeatStatus.AVAILABLE, null, null, null,null);
//
//        when(showtimeSeatRepository.findByShowtimeIdAndSeatIdentifier(eq(1L), eq("A1")))
//            .thenReturn(Optional.of(seat1));
//        when(showtimeSeatRepository.findByShowtimeIdAndSeatIdentifier(eq(1L), eq("A2")))
//            .thenReturn(Optional.of(seat2));
//        when(showtimeSeatRepository.saveAll(anyList()))
//            .thenReturn(List.of(seat1, seat2));
//
//        Booking booking = new Booking();
//        booking.setId(1L);
//        booking.setUserId("testUserId");
//        booking.setStatus(BookingStatus.CONFIRMED);
//
//        when(bookingRepository.save(any(Booking.class))).thenReturn(booking);
//
//        PaymentResponseDto paymentResponse = new PaymentResponseDto();
//        paymentResponse.setBookingId(1L);
//        paymentResponse.setStatus(PaymentResponseDto.PaymentStatus.SUCCEEDED);
//        paymentResponse.setTransactionId("txn_12345");
//
//        when(paymentClient.processPayment(any(PaymentRequestDto.class)))
//            .thenReturn(ResponseEntity.ok(paymentResponse));
//
//        // Act
//        BookingResponseDto responseDto = bookingService.createBooking(requestDto, "testUserId");
//
//        // Assert
//        assertNotNull(responseDto);
//        assertEquals(BookingStatus.CONFIRMED, responseDto.getStatus());
//        verify(movieCatalogClient, times(1)).getShowtimeById(eq(1L));
//        verify(bookingRepository, times(1)).save(any(Booking.class));
//        verify(paymentClient, times(1)).processPayment(any(PaymentRequestDto.class));
//    }

    @Test
    void testCreateBooking_IncompleteShowtimeDetails() {
        // Arrange
        BookingRequestDto requestDto = new BookingRequestDto();
        requestDto.setShowtimeId(1L);
        requestDto.setNumberOfSeats(2);
        requestDto.setSelectedSeats(List.of("A1", "A2"));

        ShowtimeDto showtimeDto = new ShowtimeDto();
        // Missing price, movieId, and theaterId
        when(movieCatalogClient.getShowtimeById(eq(1L)))
            .thenReturn(ResponseEntity.ok(showtimeDto));

        // Act & Assert
        BookingException exception = assertThrows(BookingException.class, () -> {
            bookingService.createBooking(requestDto, "testUserId");
        });
//        assertEquals("Incomplete showtime details (Movie, Theater, or Price missing).", exception.getMessage());
    }

    @Test
    void testGetBookingById_Success() {
        // Arrange
        Long bookingId = 1L;
        Booking booking = new Booking();
        booking.setId(bookingId);
        booking.setUserId("testUserId");
        booking.setShowtimeId(1L);
        booking.setStatus(BookingStatus.CONFIRMED);

        when(bookingRepository.findByIdAndUserId(eq(bookingId), eq("testUserId")))
            .thenReturn(Optional.of(booking));

        // Act
        BookingResponseDto responseDto = bookingService.getBookingById(bookingId, "testUserId");

        // Assert
        assertNotNull(responseDto);
        assertEquals(bookingId, responseDto.getId());
        verify(bookingRepository, times(1)).findByIdAndUserId(eq(bookingId), eq("testUserId"));
    }

    @Test
    void testGetBookingById_NotFound() {
        // Arrange
        Long bookingId = 2L;
        when(bookingRepository.findByIdAndUserId(eq(bookingId), eq("testUserId")))
            .thenReturn(Optional.empty());

        // Act & Assert
        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class, () -> {
            bookingService.getBookingById(bookingId, "testUserId");
        });
//        assertEquals("Booking not found with id 2 for user testUserId.", exception.getMessage());
        verify(bookingRepository, times(1)).findByIdAndUserId(eq(bookingId), eq("testUserId"));
    }
}