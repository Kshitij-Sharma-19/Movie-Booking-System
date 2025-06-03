package com.movie.booking.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import com.movie.booking.dto.BookingRequestDto;
import com.movie.booking.dto.BookingResponseDto;
import com.movie.booking.model.BookingStatus;
import com.movie.booking.service.BookingService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/bookings")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Booking Management", description = "APIs for creating and retrieving movie bookings")
@SecurityRequirement(name = "bearerAuth") // All endpoints require authentication
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    @Operation(summary = "Create a new booking", description = "Creates a booking for the authenticated user.")
    @ApiResponse(responseCode = "201", description = "Booking created/confirmed successfully")
    @ApiResponse(responseCode = "200", description = "Booking attempt finished but resulted in failure (e.g., Payment Failed)")
    @ApiResponse(responseCode = "400", description = "Invalid input (validation error, insufficient seats, past showtime)")
    @ApiResponse(responseCode = "404", description = "Showtime not found")
    @ApiResponse(responseCode = "500", description = "Internal server error during booking process")
    @ApiResponse(responseCode = "503", description = "Dependent service (Catalog/Payment) unavailable")
    public ResponseEntity<BookingResponseDto> createBooking(
            @Valid @RequestBody BookingRequestDto bookingRequest,
            @Parameter(hidden = true) @AuthenticationPrincipal Jwt jwt) { // Inject authenticated user's JWT

        String userId = jwt.getSubject(); // Get user identifier from JWT subject claim
        log.info("Received booking request from user: {}", userId);

        BookingResponseDto responseDto = bookingService.createBooking(bookingRequest, userId);

        // Return 201 CREATED if confirmed, 200 OK otherwise (e.g., payment failed)
        HttpStatus status = (responseDto.getStatus() == BookingStatus.CONFIRMED)
                            ? HttpStatus.CREATED
                            : HttpStatus.OK;

        return new ResponseEntity<>(responseDto, status);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get booking by ID", description = "Retrieves a specific booking by its ID for the authenticated user.")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved booking")
    @ApiResponse(responseCode = "404", description = "Booking not found for this user")
    public ResponseEntity<BookingResponseDto> getBookingById(
            @PathVariable Long id,
            @Parameter(hidden = true) @AuthenticationPrincipal Jwt jwt) {

        String userId = jwt.getSubject();
        return ResponseEntity.ok(bookingService.getBookingById(id, userId));
    }

    @GetMapping("/my-bookings")
    @Operation(summary = "Get my bookings", description = "Retrieves all bookings for the authenticated user.")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved booking list")
    public ResponseEntity<List<BookingResponseDto>> getMyBookings(
            @Parameter(hidden = true) @AuthenticationPrincipal Jwt jwt) {

        String userId = jwt.getSubject();
        return ResponseEntity.ok(bookingService.getBookingsByUserId(userId));
    }

    // Optional: Cancellation Endpoint
    @PatchMapping("/{id}/cancel")
    @Operation(summary = "Cancel a booking", description = "Attempts to cancel a specific booking by ID for the authenticated user.")
    @ApiResponse(responseCode = "200", description = "Booking cancelled successfully")
    @ApiResponse(responseCode = "400", description = "Cancellation not allowed (e.g., too close to showtime, booking not confirmed)")
    @ApiResponse(responseCode = "404", description = "Booking not found for this user")
    @ApiResponse(responseCode = "500", description = "Internal error during cancellation (e.g., refund failed, seat increase failed)")
     public ResponseEntity<BookingResponseDto> cancelBooking(
            @PathVariable Long id,
            @Parameter(hidden = true) @AuthenticationPrincipal Jwt jwt) {

        String userId = jwt.getSubject();
        return ResponseEntity.ok(bookingService.cancelBooking(id, userId));
    }

}