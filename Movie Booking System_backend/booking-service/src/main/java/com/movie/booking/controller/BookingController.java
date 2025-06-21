package com.movie.booking.controller;

import com.movie.booking.dto.BookingRequestDto;
import com.movie.booking.dto.BookingResponseDto;
import com.movie.booking.dto.SeatInitRequestDto; // NEW IMPORT
import com.movie.booking.dto.ShowtimeSeatResponseDto; // NEW IMPORT
import com.movie.booking.service.BookingService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;

import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Slf4j
@SecurityRequirement(name = "bearerAuth") // Apply to all methods in this controller
public class BookingController {

    private final BookingService bookingService;

    @PostMapping("/bookings")
    @Operation(summary = "Create a new booking",
               description = "Creates a new booking for the authenticated user. User ID is extracted from JWT.",
               responses = {
                    @ApiResponse(responseCode = "201", description = "Booking created successfully"),
                    @ApiResponse(responseCode = "400", description = "Invalid request (e.g., validation error, seats not available)"),
                    @ApiResponse(responseCode = "401", description = "Unauthorized"),
                    @ApiResponse(responseCode = "404", description = "Showtime not found"),
                    @ApiResponse(responseCode = "500", description = "Internal server error or payment processing issue")
               })
    public ResponseEntity<BookingResponseDto> createBooking(
            @Valid @RequestBody BookingRequestDto bookingRequestDto,
            @Parameter(hidden = true) @AuthenticationPrincipal Jwt jwt) {
        String userId = jwt.getSubject(); // Get user ID from JWT subject claim
        log.info("Received booking request from user: {} for showtime: {}", userId, bookingRequestDto.getShowtimeId());
        BookingResponseDto bookingResponse = bookingService.createBooking(bookingRequestDto, userId);
        // Typically, successful creation returns 201 Created
        return ResponseEntity.status(HttpStatus.CREATED).body(bookingResponse);
    }

    @GetMapping("/bookings/{id}")
    @Operation(summary = "Get a booking by ID",
               description = "Retrieves a specific booking by its ID for the authenticated user.",
               responses = {
                    @ApiResponse(responseCode = "200", description = "Booking found"),
                    @ApiResponse(responseCode = "401", description = "Unauthorized"),
                    @ApiResponse(responseCode = "404", description = "Booking not found for this user")
               })
    public ResponseEntity<BookingResponseDto> getBookingById(
            @PathVariable Long id,
            @Parameter(hidden = true) @AuthenticationPrincipal Jwt jwt) {
        String userId = jwt.getSubject();
        log.info("Fetching booking with id: {} for user: {}", id, userId);
        return ResponseEntity.ok(bookingService.getBookingById(id, userId));
    }

    @GetMapping("/bookings/my-bookings")
    @Operation(summary = "Get all bookings for the current user",
               description = "Retrieves all bookings made by the authenticated user, ordered by booking time descending.",
               responses = {
                    @ApiResponse(responseCode = "200", description = "List of bookings retrieved"),
                    @ApiResponse(responseCode = "401", description = "Unauthorized")
               })
    public ResponseEntity<List<BookingResponseDto>> getMyBookings(
            @Parameter(hidden = true) @AuthenticationPrincipal Jwt jwt) {
        String userId = jwt.getSubject();
        log.info("Fetching all bookings for user: {}", userId);
        return ResponseEntity.ok(bookingService.getBookingsByUserId(userId));
    }

    @PatchMapping("/bookings/{id}/cancel")
    @Operation(summary = "Cancel a booking",
               description = "Cancels a specific booking by its ID for the authenticated user. Conditions for cancellation apply (e.g., not too close to showtime).",
               responses = {
                    @ApiResponse(responseCode = "200", description = "Booking cancelled successfully"),
                    @ApiResponse(responseCode = "400", description = "Cancellation not allowed (e.g., already past, not confirmed)"),
                    @ApiResponse(responseCode = "401", description = "Unauthorized"),
                    @ApiResponse(responseCode = "404", description = "Booking not found for this user")
               })
    public ResponseEntity<BookingResponseDto> cancelBooking(
            @PathVariable Long id,
            @Parameter(hidden = true) @AuthenticationPrincipal Jwt jwt) {
        String userId = jwt.getSubject();
        log.info("Attempting to cancel booking with id: {} for user: {}", id, userId);
        return ResponseEntity.ok(bookingService.cancelBooking(id, userId));
    }

    // --- New Endpoints ---

    @GetMapping("/showtimes/{showtimeId}/seats")
    @Operation(summary = "Get seat layout for a showtime",
               description = "Retrieves the current status of all seats for a given showtime. Requires authentication.",
               responses = {
                    @ApiResponse(responseCode = "200", description = "Seat layout retrieved successfully"),
                    @ApiResponse(responseCode = "401", description = "Unauthorized"),
                    @ApiResponse(responseCode = "404", description = "Showtime not found or no seats initialized")
               })
    public ResponseEntity<List<ShowtimeSeatResponseDto>> getSeatLayout(@PathVariable Long showtimeId) {
        log.info("Fetching seat layout for showtimeId: {}", showtimeId);
        List<ShowtimeSeatResponseDto> seatLayout = bookingService.getSeatsForShowtime(showtimeId);
        if (seatLayout.isEmpty()) {
            // Optionally check if showtime itself exists to differentiate
            // For now, if no seats, could be 404 if we assume seats should always exist for a valid showtime
            // return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(seatLayout);
    }

    @PostMapping("/admin/showtimes/{showtimeId}/initialize-seats")
    @Operation(summary = "Initialize seats for a showtime (Admin)",
               description = "Creates the seat records for a given showtime based on total capacity and layout. This is typically an admin or internal operation. Ensure appropriate security if exposing externally.",
               responses = {
                    @ApiResponse(responseCode = "200", description = "Seats initialized/verified successfully"),
                    @ApiResponse(responseCode = "400", description = "Invalid request parameters"),
                    // Add 401/403 if you secure this admin endpoint differently
               })
    // Consider adding specific admin role security here if your general bearerAuth is for all users
    public ResponseEntity<String> initializeSeatsForShowtime(
            @PathVariable Long showtimeId,
            @Valid @RequestBody SeatInitRequestDto requestDto) {
        log.info("Admin request to initialize seats for showtimeId: {} with totalSeats: {}, seatsPerRow: {}",
                 showtimeId, requestDto.getTotalSeats(), requestDto.getSeatsPerRow());
        String resultMessage = bookingService.initializeSeatsForShowtime(showtimeId, requestDto);
        return ResponseEntity.ok(resultMessage);
    }
}