package com.movie.booking.service;

import feign.FeignException;
import io.github.resilience4j.circuitbreaker.CallNotPermittedException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.movie.booking.client.MovieCatalogClient;
import com.movie.booking.client.PaymentClient;
import com.movie.booking.dto.BookingRequestDto;
import com.movie.booking.dto.BookingResponseDto;
import com.movie.booking.dto.PaymentRequestDto;
import com.movie.booking.dto.PaymentResponseDto;
import com.movie.booking.dto.ShowtimeDto;
import com.movie.booking.exception.BookingException;
import com.movie.booking.exception.ResourceNotFoundException;
import com.movie.booking.model.Booking;
import com.movie.booking.model.BookingStatus;
import com.movie.booking.repository.BookingRepository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
@Slf4j
public class BookingService {

    private final BookingRepository bookingRepository;
    private final MovieCatalogClient movieCatalogClient;
    private final PaymentClient paymentClient; // Assuming PaymentClient exists

    // --- Mapping Logic ---
     private BookingResponseDto convertToDto(Booking booking) {
        return BookingResponseDto.builder()
                .id(booking.getId())
                .userId(booking.getUserId())
                .showtimeId(booking.getShowtimeId())
                .movieId(booking.getMovieId())
                .theaterId(booking.getTheaterId())
                .numberOfSeats(booking.getNumberOfSeats())
                .totalPrice(booking.getTotalPrice())
                .bookingTime(booking.getBookingTime())
                .status(booking.getStatus())
                .paymentTransactionId(booking.getPaymentTransactionId())
                .movieTitle(booking.getMovieTitle()) // Use denormalized data
                .theaterName(booking.getTheaterName())
                .showtimeDateTime(booking.getShowtimeDateTime())
                .build();
    }
    // --- End Mapping Logic ---

    @Transactional // Make booking creation transactional
    public BookingResponseDto createBooking(BookingRequestDto request, String userId) {
        log.info("Attempting to create booking for user: {}, showtime: {}", userId, request.getShowtimeId());

        // 1. Get Showtime Details from Movie Catalog Service
        ShowtimeDto showtimeDto = getShowtimeDetails(request.getShowtimeId());

        // 2. Validate Showtime and Availability
        validateShowtime(showtimeDto, request.getNumberOfSeats());

        // 3. Create Initial Booking Record (Status: PENDING_PAYMENT)
        BigDecimal totalPrice = showtimeDto.getPrice().multiply(BigDecimal.valueOf(request.getNumberOfSeats()));
        Booking booking = Booking.builder()
                .userId(userId)
                .showtimeId(request.getShowtimeId())
                .movieId(showtimeDto.getMovie().getId()) // Denormalize
                .theaterId(showtimeDto.getTheater().getId()) // Denormalize
                .numberOfSeats(request.getNumberOfSeats())
                .totalPrice(totalPrice)
                .bookingTime(LocalDateTime.now())
                .status(BookingStatus.PENDING_PAYMENT)
                .movieTitle(showtimeDto.getMovie().getTitle()) // Denormalize
                .theaterName(showtimeDto.getTheater().getName()) // Denormalize
                .showtimeDateTime(showtimeDto.getShowtime()) // Denormalize
                .build();
        booking = bookingRepository.save(booking);
        log.info("Initial booking record created with id: {}, status: PENDING_PAYMENT", booking.getId());


        // 4. Process Payment
        PaymentResponseDto paymentResponse = processPayment(booking);

        // 5. Handle Payment Response & Update Seats/Booking Status
        if (paymentResponse.getStatus() == PaymentResponseDto.PaymentStatus.SUCCEEDED) {
            log.info("Payment successful for booking id: {}. Transaction ID: {}", booking.getId(), paymentResponse.getTransactionId());
            // Try to decrease seats in movie catalog
            boolean seatsDecreased = decreaseSeatsInCatalog(booking.getShowtimeId(), booking.getNumberOfSeats());

            if (seatsDecreased) {
                // Payment succeeded AND seats decreased -> Confirm Booking
                booking.setStatus(BookingStatus.CONFIRMED);
                booking.setPaymentTransactionId(paymentResponse.getTransactionId());
                log.info("Booking confirmed for id: {}", booking.getId());
            } else {
                // Payment succeeded BUT seats could NOT be decreased -> Critical Failure!
                // Need compensation: Refund payment
                log.error("CRITICAL: Payment succeeded but failed to decrease seats for booking id: {}. Initiating refund.", booking.getId());
                // TODO: Implement refund logic via PaymentClient
                // paymentClient.refundPayment(...)
                booking.setStatus(BookingStatus.PAYMENT_FAILED); // Or a specific error status
                booking.setPaymentTransactionId(paymentResponse.getTransactionId()); // Store transaction ID even if refund needed
                // Throw exception to indicate booking failure despite payment
                 throw new BookingException("Booking failed: Could not reserve seats after successful payment. Payment will be refunded.", booking.getId());
            }
        } else {
            // Payment failed
            log.warn("Payment failed for booking id: {}. Reason: {}", booking.getId(), paymentResponse.getMessage());
            booking.setStatus(BookingStatus.PAYMENT_FAILED);
            // No need to decrease seats
        }

        // Save final booking state
        Booking finalBooking = bookingRepository.save(booking);
        return convertToDto(finalBooking);
    }


    private ShowtimeDto getShowtimeDetails(Long showtimeId) {
        log.debug("Fetching showtime details for id: {}", showtimeId);
        try {
            ResponseEntity<ShowtimeDto> response = movieCatalogClient.getShowtimeById(showtimeId);
            if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
                log.error("Failed to fetch showtime details for id: {}. Status: {}", showtimeId, response.getStatusCode());
                throw new BookingException("Could not retrieve showtime details.", null);
            }
             // Ensure nested objects are present if needed for denormalization
            ShowtimeDto dto = response.getBody();
            if (dto.getMovie() == null || dto.getTheater() == null) {
                 log.error("Incomplete showtime details received for id: {}", showtimeId);
                 throw new BookingException("Incomplete showtime details received from catalog service.", null);
            }
            log.debug("Successfully fetched showtime details for id: {}", showtimeId);
            return dto;
        } catch (MovieCatalogClient.ServiceUnavailableException | CallNotPermittedException e) {
             log.error("Error fetching showtime details for id: {} due to service availability/circuit breaker", showtimeId, e);
            throw new BookingException("Movie Catalog Service is currently unavailable. Please try again later.", null);
        } catch (FeignException e) {
             log.error("Feign error fetching showtime details for id: {}", showtimeId, e);
             if (e.status() == 404) {
                 throw new ResourceNotFoundException("Showtime", "id", showtimeId);
             }
             throw new BookingException("Error communicating with Movie Catalog Service.", null);
        } catch (Exception e) {
             log.error("Unexpected error fetching showtime details for id: {}", showtimeId, e);
             throw new BookingException("An unexpected error occurred while fetching showtime details.", null);
        }
    }

    private void validateShowtime(ShowtimeDto showtimeDto, int requestedSeats) {
         if (showtimeDto.getShowtime().isBefore(LocalDateTime.now())) {
            log.warn("Attempted booking for past showtime id: {}", showtimeDto.getId());
            throw new BookingException("Cannot book for a showtime that has already passed.", showtimeDto.getId());
        }
        if (showtimeDto.getAvailableSeats() == null || showtimeDto.getAvailableSeats() < requestedSeats) {
            log.warn("Insufficient seats for showtime id: {}. Available: {}, Requested: {}",
                     showtimeDto.getId(), showtimeDto.getAvailableSeats(), requestedSeats);
            throw new BookingException(String.format("Not enough seats available for showtime. Only %d left.", showtimeDto.getAvailableSeats()), showtimeDto.getId());
        }
    }

     private PaymentResponseDto processPayment(Booking booking) {
        log.info("Initiating payment process for booking id: {}", booking.getId());
        PaymentRequestDto paymentRequest = PaymentRequestDto.builder()
                .bookingId(booking.getId())
                .userId(booking.getUserId())
                .amount(booking.getTotalPrice())
                .currency("INR") // Example currency, make configurable
                .paymentMethodNonce("fake-nonce") // Placeholder for actual payment method details
                .build();
        try {
             ResponseEntity<PaymentResponseDto> response = paymentClient.processPayment(paymentRequest);
             if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
                  log.error("Payment processing failed for booking id: {}. Status: {}", booking.getId(), response.getStatusCode());
                  // Return a failed response DTO based on the error status
                   return PaymentResponseDto.builder()
                            .bookingId(booking.getId())
                            .status(PaymentResponseDto.PaymentStatus.FAILED)
                            .message("Payment processing failed with status: " + response.getStatusCode())
                            .build();
             }
             log.info("Payment response received for booking id: {}. Status: {}", booking.getId(), response.getBody().getStatus());
             return response.getBody();
        } catch (MovieCatalogClient.ServiceUnavailableException | CallNotPermittedException e) { // Reusing exception for demo
             log.error("Payment processing failed for booking id: {} due to service availability/circuit breaker", booking.getId(), e);
              return PaymentResponseDto.builder()
                        .bookingId(booking.getId())
                        .status(PaymentResponseDto.PaymentStatus.FAILED)
                        .message("Payment service unavailable. Please try again later.")
                        .build();
        } catch (FeignException e) {
            log.error("Feign error during payment processing for booking id: {}", booking.getId(), e);
             return PaymentResponseDto.builder()
                        .bookingId(booking.getId())
                        .status(PaymentResponseDto.PaymentStatus.FAILED)
                        .message("Error communicating with Payment Service.")
                        .build();
        } catch (Exception e) {
             log.error("Unexpected error during payment processing for booking id: {}", booking.getId(), e);
              return PaymentResponseDto.builder()
                        .bookingId(booking.getId())
                        .status(PaymentResponseDto.PaymentStatus.FAILED)
                        .message("An unexpected error occurred during payment.")
                        .build();
        }
    }

     private boolean decreaseSeatsInCatalog(Long showtimeId, int seatsToDecrease) {
        log.info("Attempting to decrease seats by {} for showtime id: {}", seatsToDecrease, showtimeId);
        try {
            ResponseEntity<Void> response = movieCatalogClient.decreaseSeats(showtimeId, seatsToDecrease);
            boolean success = response.getStatusCode().is2xxSuccessful();
            if(success) {
                 log.info("Successfully decreased seats for showtime id: {}", showtimeId);
            } else {
                 log.error("Failed to decrease seats for showtime id: {}. Status code: {}", showtimeId, response.getStatusCode());
            }
            return success;
        } catch (MovieCatalogClient.ServiceUnavailableException | CallNotPermittedException e) {
            log.error("Failed to decrease seats for showtime id: {} due to service availability/circuit breaker", showtimeId, e);
            return false;
        } catch (FeignException e) {
             log.error("Feign error while decreasing seats for showtime id: {}", showtimeId, e);
             // Check if the error was due to insufficient seats (e.g., 400 Bad Request from catalog service)
             if (e.status() == 400) {
                 // Potentially parse error message if available from catalog service
                 log.warn("Seat decrease failed for showtime {}: {}", showtimeId, "Likely insufficient seats.");
             }
             return false;
        } catch (Exception e) {
            log.error("Unexpected error while decreasing seats for showtime id: {}", showtimeId, e);
            return false;
        }
    }


     // --- Read Operations ---

    public BookingResponseDto getBookingById(Long id, String userId) {
        log.info("Fetching booking by id: {} for user: {}", id, userId);
        // Ensure user can only fetch their own booking
        Booking booking = bookingRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id/userId", id + "/" + userId));
        return convertToDto(booking);
    }

    public List<BookingResponseDto> getBookingsByUserId(String userId) {
        log.info("Fetching all bookings for user: {}", userId);
        List<Booking> bookings = bookingRepository.findByUserIdOrderByBookingTimeDesc(userId);
        return bookings.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    // --- Cancellation Logic (Placeholder) ---
    @Transactional
    public BookingResponseDto cancelBooking(Long bookingId, String userId) {
         log.warn("Attempting cancellation for booking id: {} by user: {}", bookingId, userId);
         Booking booking = bookingRepository.findByIdAndUserId(bookingId, userId)
                 .orElseThrow(() -> new ResourceNotFoundException("Booking", "id/userId", bookingId + "/" + userId));

        // 1. Check if cancellation is allowed (e.g., status is CONFIRMED, showtime is in future)
        if (booking.getStatus() != BookingStatus.CONFIRMED) {
            throw new BookingException("Booking cannot be cancelled as it is not confirmed.", bookingId);
        }
        if (booking.getShowtimeDateTime() != null && booking.getShowtimeDateTime().isBefore(LocalDateTime.now().plusHours(2))) { // Example: Allow cancellation up to 2 hours before
             throw new BookingException("Booking cannot be cancelled this close to the showtime.", bookingId);
        }

        // 2. TODO: Process Refund via Payment Client
        log.info("Initiating refund for booking id: {}", bookingId);
        // RefundResponseDto refundResponse = paymentClient.refundPayment(...);
        boolean refundSuccessful = true; // Assume success for now

        if (refundSuccessful) {
             // 3. Increase Seats in Catalog Service
            boolean seatsIncreased = increaseSeatsInCatalog(booking.getShowtimeId(), booking.getNumberOfSeats());
            if (seatsIncreased) {
                booking.setStatus(BookingStatus.CANCELLED);
                 log.info("Booking id: {} cancelled successfully.", bookingId);
            } else {
                // Refund succeeded, but increasing seats failed! Log error, maybe manual intervention needed.
                 log.error("CRITICAL: Refund succeeded for booking id: {} but failed to increase seat count.", bookingId);
                 // Keep status as CONFIRMED? Or a special 'CANCELLATION_FAILED_SEATS' status?
                 throw new BookingException("Cancellation failed: Could not release seats after successful refund. Please contact support.", bookingId);
            }
        } else {
             log.error("Refund failed for booking id: {}", bookingId);
             throw new BookingException("Cancellation failed: Could not process refund.", bookingId);
        }

         Booking updatedBooking = bookingRepository.save(booking);
         return convertToDto(updatedBooking);
    }

     private boolean increaseSeatsInCatalog(Long showtimeId, int seatsToIncrease) {
        log.info("Attempting to increase seats by {} for showtime id: {}", seatsToIncrease, showtimeId);
         try {
            ResponseEntity<Void> response = movieCatalogClient.increaseSeats(showtimeId, seatsToIncrease);
            boolean success = response.getStatusCode().is2xxSuccessful();
             if(success) {
                 log.info("Successfully increased seats for showtime id: {}", showtimeId);
            } else {
                 log.error("Failed to increase seats for showtime id: {}. Status code: {}", showtimeId, response.getStatusCode());
            }
            return success;
        } catch (MovieCatalogClient.ServiceUnavailableException | CallNotPermittedException e) {
            log.error("Failed to increase seats for showtime id: {} due to service availability/circuit breaker", showtimeId, e);
            return false; // Indicate failure
        } catch (FeignException e) {
             log.error("Feign error while increasing seats for showtime id: {}", showtimeId, e);
             return false;
        } catch (Exception e) {
            log.error("Unexpected error while increasing seats for showtime id: {}", showtimeId, e);
            return false;
        }
    }

}