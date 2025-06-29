package com.movie.booking.service;

import com.movie.booking.client.MovieCatalogClient; 
import com.movie.booking.client.PaymentClient;
import com.movie.booking.dto.*;
import com.movie.booking.dto.ShowtimeDto.MovieDto;
import com.movie.booking.dto.ShowtimeDto.TheaterDto;
import com.movie.booking.exception.BookingException;
import com.movie.booking.exception.ResourceNotFoundException;
import com.movie.booking.model.Booking;
import com.movie.booking.model.BookingStatus;
import com.movie.booking.model.SeatStatus;
import com.movie.booking.model.ShowtimeSeat;
import com.movie.booking.repository.BookingRepository;
import com.movie.booking.repository.ShowtimeSeatRepository;
import com.movie.booking.util.PdfGenerator;
import com.movie.booking.util.UserEmailResolver;

import feign.FeignException;
import io.github.resilience4j.circuitbreaker.CallNotPermittedException;
import jakarta.mail.MessagingException;
import jakarta.persistence.OptimisticLockException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ShowtimeSeatRepository showtimeSeatRepository;
    private final MovieCatalogClient movieCatalogClient;
    private final PaymentClient paymentClient;

    private static final int SEAT_LOCK_DURATION_MINUTES = 10;
    private static final int DEFAULT_SEATS_PER_ROW = 10;
    private static final int MAX_ROWS = 26; // A-Z
    private static final int MAX_SEATS_PER_ROW_FOR_ALPHANUMERIC = 10; // Your fixed A1-A10 rule
    private static final int ABSOLUTE_MAX_SEATS = MAX_ROWS * MAX_SEATS_PER_ROW_FOR_ALPHANUMERIC; // 260

    @Autowired
    private EmailService emailService;
    @Autowired
    private UserEmailResolver userEmailResolver;

    /**
     * Initializes seat records for a given showtime if they don't already exist.
     * This method is idempotent. Seats are named A1-A10, B1-B10, ..., up to Z1-Z10.
     * Max seats generated is 260.
     *
     * @param showtimeId     The ID of the showtime.
     * @param requestDto     DTO containing totalSeats and optionally seatsPerRow.
     */
    @Transactional
    public String initializeSeatsForShowtime(Long showtimeId, SeatInitRequestDto requestDto) {
        log.info("Attempting to initialize seats for showtimeId: {} with requested totalSeats: {}, requested seatsPerRow: {}",
                showtimeId, requestDto.getTotalSeats(), requestDto.getSeatsPerRow());

        if (showtimeId == null || requestDto == null || requestDto.getTotalSeats() == null || requestDto.getTotalSeats() <= 0) {
            String errorMsg = String.format("Invalid input for seat initialization. ShowtimeId: %s, Requested TotalSeats: %s, Requested SeatsPerRow: %s",
                                            showtimeId, requestDto != null ? requestDto.getTotalSeats() : "null", requestDto != null ? requestDto.getSeatsPerRow() : "null");
            log.warn(errorMsg);
            throw new IllegalArgumentException(errorMsg);
        }

        int requestedTotalSeats = requestDto.getTotalSeats();
        // For A1-Z10 scheme, seatsPerRow is fixed at 10.
        // The input requestDto.seatsPerRow will be ignored if it's different from 10 for this scheme.
        int seatsPerRow = MAX_SEATS_PER_ROW_FOR_ALPHANUMERIC; 

        if (requestDto.getSeatsPerRow() != null && requestDto.getSeatsPerRow() != seatsPerRow) {
            log.warn("Requested seatsPerRow ({}) for showtimeId {} is different from the fixed {} seats/row for A1-Z10 scheme. Using {} seats/row.",
                     requestDto.getSeatsPerRow(), showtimeId, seatsPerRow, seatsPerRow);
        }
        
        // Cap the number of seats to be created at ABSOLUTE_MAX_SEATS (260)
        int actualTotalSeatsToCreate = Math.min(requestedTotalSeats, ABSOLUTE_MAX_SEATS);
        if (requestedTotalSeats > ABSOLUTE_MAX_SEATS) {
            log.warn("Requested totalSeats ({}) for showtimeId {} exceeds the maximum of {}. Capping at {}.",
                     requestedTotalSeats, showtimeId, ABSOLUTE_MAX_SEATS, actualTotalSeatsToCreate);
        }

        long deletedCount = showtimeSeatRepository.deleteByShowtimeId(showtimeId);
        if (deletedCount > 0) {
            log.info("Deleted {} existing seat(s) for showtimeId {} before re-initialization.", deletedCount, showtimeId);
        }

        List<ShowtimeSeat> seatsToCreate = new ArrayList<>();
        int seatsCreatedCount = 0;

        for (int rowIndex = 0; rowIndex < MAX_ROWS; rowIndex++) {
            if (seatsCreatedCount >= actualTotalSeatsToCreate) {
                break; // Stop if we've reached the capped total number of seats
            }
            char currentRowChar = (char) ('A' + rowIndex); // A, B, C, ...

            for (int seatNumInRow = 1; seatNumInRow <= seatsPerRow; seatNumInRow++) {
                if (seatsCreatedCount >= actualTotalSeatsToCreate) {
                    break; // Stop if we've reached the capped total
                }

                String seatIdentifier = String.format("%c%d", currentRowChar, seatNumInRow);

                ShowtimeSeat seat = ShowtimeSeat.builder()
                        .showtimeId(showtimeId)
                        .seatIdentifier(seatIdentifier)
                        .status(SeatStatus.AVAILABLE)
                        .version(0L)
                        .build();
                seatsToCreate.add(seat);
                seatsCreatedCount++;
            }
        }

        if (!seatsToCreate.isEmpty()) {
            showtimeSeatRepository.saveAll(seatsToCreate);
            log.info("Successfully initialized {} new seats (requested: {}, capped at: {}) for showtimeId: {}. Layout: A1-{} up to {}{}.",
                     seatsToCreate.size(), requestedTotalSeats, actualTotalSeatsToCreate, showtimeId,
                     seatsPerRow, (char)('A' + (seatsToCreate.size() / seatsPerRow) - (seatsToCreate.size() % seatsPerRow == 0 ? 1: 0)),
                     seatsToCreate.size() % seatsPerRow == 0 ? seatsPerRow : seatsToCreate.size() % seatsPerRow
                     );
            return String.format("Successfully initialized %d seats for showtime %d.", seatsToCreate.size(), showtimeId);
        } else {
            log.warn("No seats were generated for showtimeId: {}. Requested total seats: {}, Capped at: {}",
                     showtimeId, requestedTotalSeats, actualTotalSeatsToCreate);
            return String.format("No seats generated for showtime %d (requested totalSeats: %d, capped at: %d).",
                                 showtimeId, requestedTotalSeats, actualTotalSeatsToCreate);
        }
    }

    // ... (rest of the BookingService class remains the same)
    // getSeatsForShowtime, createBooking, lockSeats, updateSeatsForPendingPayment,
    // confirmSeatsAsBooked, releaseSeats, getShowtimeDetails, validateShowtimeForBooking,
    // processPayment, getBookingById, getBookingsByUserId, cancelBooking, simulateRefund,
    // cleanupExpiredSeatLocks, convertToDto
    // Make sure all these methods are still present below this point.
    // ...


    /**
     * Retrieves the seat layout for a given showtime.
     *
     * @param showtimeId The ID of the showtime.
     * @return A list of DTOs representing each seat's status.
     */
    public List<ShowtimeSeatResponseDto> getSeatsForShowtime(Long showtimeId) {
        log.debug("Fetching seat layout for showtimeId: {}", showtimeId);

        List<ShowtimeSeat> seats = showtimeSeatRepository.findAllByShowtimeId(showtimeId);

        if (seats.isEmpty()) {
            log.warn("No seats found for showtimeId: {}. Attempting to validate showtime existence.", showtimeId);
            // Check if the showtime itself is valid before concluding seats are just not initialized.
            try {
                getShowtimeDetails(showtimeId); // This will throw ResourceNotFoundException if showtime doesn't exist
                // If getShowtimeDetails succeeds, it means showtime is valid but seats are not initialized.
                log.warn("Showtime {} is valid, but no seats are initialized.", showtimeId);
            } catch (ResourceNotFoundException e) {
                log.warn("Showtime {} not found in catalog. Cannot provide seat layout.", showtimeId);
                throw e; // Re-throw because the primary resource (showtime) is missing.
            }
            return Collections.emptyList(); // Return empty if showtime valid but seats not initialized
        }

        Comparator<ShowtimeSeat> seatComparator = Comparator
            .comparing((ShowtimeSeat seat) -> seat.getSeatIdentifier().substring(0, 1)) // Sort by row letter
            .thenComparingInt(seat -> { // Then by seat number
                try {
                    return Integer.parseInt(seat.getSeatIdentifier().substring(1));
                } catch (NumberFormatException e) {
                    log.warn("Could not parse seat number for identifier '{}'. Using 0 for sorting.", seat.getSeatIdentifier());
                    return 0; // Fallback for non-standard seat numbers
                }
            });

        return seats.stream()
                .sorted(seatComparator)
                .map(seat -> ShowtimeSeatResponseDto.builder()
                        .id(seat.getId())
                        .seatIdentifier(seat.getSeatIdentifier())
                        .status(seat.getStatus())
                        .userId(seat.getUserId())
                        .build())
                .collect(Collectors.toList());
    }

    /**
     * Creates a new booking, including seat locking and payment processing.
     *
     * @param request The booking request DTO.
     * @param userId  The ID of the user making the booking.
     * @return A DTO representing the created booking.
     */
//    @Transactional
//    public BookingResponseDto createBooking(BookingRequestDto request, String userId) {
//        log.info("Attempting to create booking for user: {}, showtime: {}, seats: {}",
//                 userId, request.getShowtimeId(), request.getSelectedSeats());
//
//        if (request.getSelectedSeats() == null || request.getSelectedSeats().isEmpty()) {
//            throw new BookingException("No seats selected for booking.", request.getShowtimeId());
//        }
//
//        ShowtimeDto showtimeDto = getShowtimeDetails(request.getShowtimeId());
//        validateShowtimeForBooking(showtimeDto);
//
//        List<ShowtimeSeat> lockedSeats = lockSeats(request.getShowtimeId(), request.getSelectedSeats(), userId);
//
//        Booking booking = null;
//        try {
//            BigDecimal totalPrice = showtimeDto.getPrice().multiply(BigDecimal.valueOf(lockedSeats.size()));
//            booking = Booking.builder()
//                    .userId(userId)
//                    .showtimeId(request.getShowtimeId())
//                    .movieId(showtimeDto.getMovie().getId())
//                    .theaterId(showtimeDto.getTheater().getId())
//                    .selectedSeats(request.getSelectedSeats()) // Store identifiers
//                    .totalPrice(totalPrice)
//                    .bookingTime(LocalDateTime.now())
//                    .status(BookingStatus.PENDING_PAYMENT) // Initial status
//                    .movieTitle(showtimeDto.getMovie().getTitle())
//                    .theaterName(showtimeDto.getTheater().getName())
//                    .showtimeDateTime(showtimeDto.getShowtime())
//                    .build();
//            booking = bookingRepository.save(booking);
//            log.info("Initial booking record created with id: {}, status: PENDING_PAYMENT", booking.getId());
//
//            updateSeatsForPendingPayment(lockedSeats, booking.getId(), userId);
//
//            PaymentResponseDto paymentResponse = processPayment(booking);
//
//            if (paymentResponse.getStatus() == PaymentResponseDto.PaymentStatus.SUCCEEDED) {
//                confirmSeatsAsBooked(lockedSeats, booking.getId());
//                booking.setStatus(BookingStatus.CONFIRMED);
//                booking.setPaymentTransactionId(paymentResponse.getTransactionId());
//                log.info("Booking id: {} payment successful. Status: CONFIRMED. Transaction ID: {}", booking.getId(), paymentResponse.getTransactionId());
//                log.info("Generating pdf and sending mail for: {}.Status: CONFIRMED. Transaction ID: {}", booking.getId(), paymentResponse.getTransactionId());
////                generatePdf(request,userId,booking.getId());
//            } else {
//                log.warn("Payment failed for booking id: {}. Reason: {}. Releasing seats.", booking.getId(), paymentResponse.getMessage());
//                releaseSeats(lockedSeats, "Payment failed for bookingId: " + booking.getId());
//                booking.setStatus(BookingStatus.PAYMENT_FAILED);
//            }
//        } catch (Exception e) {
//            log.error("Exception during booking creation process for showtime {}. Releasing seats if locked.", request.getShowtimeId(), e);
//            if (lockedSeats != null && !lockedSeats.isEmpty()) {
//                String releaseReason = "Exception during booking creation: " + e.getMessage();
//                if (booking != null && booking.getId() != null) {
//                     releaseReason += " (Booking ID: " + booking.getId() + ")";
//                }
//                releaseSeats(lockedSeats, releaseReason);
//            }
//            if (booking != null && booking.getId() != null && booking.getStatus() == BookingStatus.PENDING_PAYMENT) {
//                booking.setStatus(BookingStatus.PAYMENT_FAILED); // Mark booking as failed
//            }
//            // Re-throw a more specific booking exception or the original one
//            if (e instanceof BookingException) throw (BookingException) e;
//            throw new BookingException("An error occurred during booking creation: " + e.getMessage(), request.getShowtimeId(), e);
//        } finally {
//            if (booking != null && booking.getId() != null) { // Ensure booking is saved if it exists
//                booking = bookingRepository.save(booking);
//            }
//            
//        }
//        return convertToDto(booking);
//    }
    
    /**
     * De-initializes (deletes) all seats for a given showtime.
     * This will remove all seat records associated with the showtimeId.
     * Use with caution! Should only be used by admin.
     *
     * @param showtimeId The ID of the showtime whose seats are to be deleted.
     * @return Number of seats deleted or a status message.
     */
    @Transactional
    public String deinitializeSeatsForShowtime(Long showtimeId) {
        log.warn("Admin request to de-initialize (delete) all seats for showtimeId: {}", showtimeId);
        if (showtimeId == null) {
            throw new IllegalArgumentException("ShowtimeId must not be null for de-initializing seats.");
        }
        long deletedCount = showtimeSeatRepository.deleteByShowtimeId(showtimeId);
        log.info("Deleted {} seats for showtimeId: {}", deletedCount, showtimeId);
        if (deletedCount > 0) {
            return String.format("Successfully deleted %d seats for showtime %d.", deletedCount, showtimeId);
        } else {
            return String.format("No seats found to delete for showtime %d.", showtimeId);
        }
    }

    /**
     * Creates a new booking, including seat locking and payment processing.
     * Returns the Stripe Checkout redirectUrl for the frontend to use.
     */
    @Transactional
    public BookingResponseDto createBooking(BookingRequestDto request, String userId) {
        log.info("Attempting to create booking for user: {}, showtime: {}, seats: {}",
                 userId, request.getShowtimeId(), request.getSelectedSeats());

        if (request.getSelectedSeats() == null || request.getSelectedSeats().isEmpty()) {
            throw new BookingException("No seats selected for booking.", request.getShowtimeId());
        }

        ShowtimeDto showtimeDto = getShowtimeDetails(request.getShowtimeId());
        validateShowtimeForBooking(showtimeDto);

        List<ShowtimeSeat> lockedSeats = lockSeats(request.getShowtimeId(), request.getSelectedSeats(), userId);

        Booking booking = null;
        PaymentResponseDto paymentResp = null;
        try {
            BigDecimal totalPrice = showtimeDto.getPrice().multiply(BigDecimal.valueOf(lockedSeats.size()));
            booking = Booking.builder()
                    .userId(userId)
                    .showtimeId(request.getShowtimeId())
                    .movieId(showtimeDto.getMovie().getId())
                    .theaterId(showtimeDto.getTheater().getId())
                    .selectedSeats(request.getSelectedSeats())
                    .totalPrice(totalPrice)
                    .bookingTime(LocalDateTime.now())
                    .status(BookingStatus.PENDING_PAYMENT) // Initial status
                    .movieTitle(showtimeDto.getMovie().getTitle())
                    .theaterName(showtimeDto.getTheater().getName())
                    .showtimeDateTime(showtimeDto.getShowtime())
                    .build();
            booking = bookingRepository.save(booking);
            log.info("Initial booking record created with id: {}, status: PENDING_PAYMENT", booking.getId());

            updateSeatsForPendingPayment(lockedSeats, booking.getId(), userId);

            // --- Stripe Checkout integration ---
            PaymentRequestDto paymentRequest = PaymentRequestDto.builder()
                    .bookingId(booking.getId())
                    .userId(booking.getUserId())
                    .amount(booking.getTotalPrice())
                    .currency("INR")
                    .build();

            paymentResp = paymentClient.createCheckoutSession(paymentRequest).getBody();

            if (paymentResp != null) {
                booking.setPaymentTransactionId(paymentResp.getTransactionId());
                bookingRepository.save(booking);
            }

            // Now we always return the booking info with the Stripe redirect URL to the frontend
            return BookingResponseDto.builder()
                    .id(booking.getId())
                    .userId(booking.getUserId())
                    .showtimeId(booking.getShowtimeId())
                    .movieId(booking.getMovieId())
                    .theaterId(booking.getTheaterId())
                    .numberOfSeats(booking.getSelectedSeats().size())
                    .selectedSeats(booking.getSelectedSeats())
                    .totalPrice(booking.getTotalPrice())
                    .bookingTime(booking.getBookingTime())
                    .status(booking.getStatus())
                    .paymentTransactionId(booking.getPaymentTransactionId())
                    .movieTitle(booking.getMovieTitle())
                    .theaterName(booking.getTheaterName())
                    .showtimeDateTime(booking.getShowtimeDateTime())
                    .redirectUrl(paymentResp != null ? paymentResp.getRedirectUrl() : null)
                    .build();

        } catch (Exception e) {
            log.error("Exception during booking creation process for showtime {}. Releasing seats if locked.", request.getShowtimeId(), e);
            if (lockedSeats != null && !lockedSeats.isEmpty()) {
                String releaseReason = "Exception during booking creation: " + e.getMessage();
                if (booking != null && booking.getId() != null) {
                     releaseReason += " (Booking ID: " + booking.getId() + ")";
                }
                releaseSeats(lockedSeats, releaseReason);
            }
            if (booking != null && booking.getId() != null && booking.getStatus() == BookingStatus.PENDING_PAYMENT) {
                booking.setStatus(BookingStatus.PAYMENT_FAILED); // Mark booking as failed
            }
            if (e instanceof BookingException) throw (BookingException) e;
            throw new BookingException("An error occurred during booking creation: " + e.getMessage(), request.getShowtimeId(), e);
        } finally {
            if (booking != null && booking.getId() != null) { // Ensure booking is saved if it exists
                booking = bookingRepository.save(booking);
            }
        }
    }

    /**
     * Called by payment-service (Stripe webhook) to mark a booking as CONFIRMED.
     */
    @Transactional
    public void confirmBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Booking", "id " + id + " not found ", null));
        booking.setStatus(BookingStatus.CONFIRMED);
        bookingRepository.save(booking);

        // Optionally, also confirm seats here
        List<ShowtimeSeat> seats = showtimeSeatRepository.findAllByBookingId(id);
        confirmSeatsAsBooked(seats, id);
        log.info("Booking {} confirmed via payment webhook.", id);
        log.info("Generating pdf and sending mail for: {}.Status: CONFIRMED. Transaction ID: {}", booking.getId());
        generatePdf(booking.getId());
        
    }
    //convert ShowDate from YYYY-MM-DD to DDth/nd/rd Month Year
    private String generateDateInFormat(String date) {
    	String year = date.substring(0, 4);
    	String month = date.substring(5, 7);
    	String date1 = date.substring(8, 10);
    	
    	String monthName = getMonthName(month);
    	StringBuilder sb = new StringBuilder();
    	if(Integer.parseInt(date1.substring(1)) == 0|| Integer.parseInt(date1.substring(1)) == 1 || Integer.parseInt(date1.substring(1)) > 3) {
    		sb.append(date1+"th "+monthName+", "+year);
    	} else if(Integer.parseInt(date1.substring(1)) == 2) {
    		sb.append(date1+"nd "+monthName+", "+year);
    	} else {
    		sb.append(date1+"rd "+monthName+", "+year);
    	}
    	return sb.toString();
    }
    
    private String getMonthName(String month) {
		int monthIndex = Integer.parseInt(month);
 
		switch(monthIndex) {
    	case 1:
    		return "January";
    	case 2:
    		return "Febuary";
    		
    	case 3:
    		return "March";
    	case 4:
    		return "April";

    	case 5:
    		return "May";

    	case 6:
    		return "June";

    	case 7:
    		return "July";

    	case 8:
    		return "August";

    	case 9:
    		return "September";

    	case 10:
    		return "October";

    	case 11:
    		return "November";

    	case 12:
    		return "December";

    	default:
    		return null;

    	}
	}

	//convert Showtime from HH-MM-SS to HH-MM-SS AM/PM
	private String generateTimeInFormat(String time) {
		// TODO Auto-generated method stub
		int hours = Integer.parseInt(time.substring(0, 2));
		StringBuilder sb = new StringBuilder();
		sb.append(time);
		if(hours >= 12 && hours <=23) {
			sb.append("PM");
		} else {
			sb.append("AM");
		}
		return sb.toString();
	}
	
    private void generatePdf(Long bookingId) {
		// TODO Auto-generated method stub
   	
    	Optional<Booking> booking = bookingRepository.findById(bookingId);
    
    	if(booking.isPresent()) {
    		String userEmail = userEmailResolver.resolveUserEmailByBookingId(bookingId);
    		String bookingDetails = "Booking ID: " + bookingId + 
    			"\nMovie: " + booking.get().getMovieTitle() + 
    			"\nSeat: " + booking.get().getSelectedSeats() + "\nDate & Time: " 
    			+ 
			    generateDateInFormat(booking.get().getShowtimeDateTime().toString().substring(0, 10)) +
			    " & "+
			    generateTimeInFormat(booking.get().getShowtimeDateTime().toString().substring(11));
    		byte[] pdfTicket = PdfGenerator.generateTicketPdf(bookingDetails);
    		// Send email
    		String htmlBody = 
    			    "<html>" +
    			    "<body style='font-family: Arial, sans-serif; color: #333;'>" +
    			    "<h2>Your Movie Booking Confirmation</h2>" +
    			    "<p><strong>Movie:</strong> " + booking.get().getMovieTitle() + "</p>" +
    			    "<p><strong>Theater:</strong> " + booking.get().getTheaterName() + "</p>" +
    			    "<p><strong>Date & Time:</strong> " + 
    			    generateDateInFormat(booking.get().getShowtimeDateTime().toString().substring(0, 10)) +
    			    " & "+
    			    generateTimeInFormat(booking.get().getShowtimeDateTime().toString().substring(11))
    			    + "</p>" +
    			    "<hr>" +
    			    "<p>Thank you for booking! Please find your ticket attached.</p>" +
    			    "</body>" +
    			    "</html>";

    		try {
    			emailService.sendBookingConfirmation(
    				    userEmail,
    				    "Your Movie Booking Confirmation", // subject
    				    htmlBody, // body
    				    pdfTicket,
    				    "ticket.pdf"
    				);
			} catch (MessagingException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
    	} else {
    		log.error("Some error while generating pdf and mail");
    	}
    	

	}



	private List<ShowtimeSeat> lockSeats(Long showtimeId, List<String> seatIdentifiers, String userId) {
        log.debug("Attempting to lock seats: {} for showtime: {} by user: {}", seatIdentifiers, showtimeId, userId);
        List<ShowtimeSeat> successfullyLockedSeats = new ArrayList<>();
        LocalDateTime lockExpiryTime = LocalDateTime.now().plusMinutes(SEAT_LOCK_DURATION_MINUTES);

        for (String seatId : seatIdentifiers) {
            ShowtimeSeat seat = showtimeSeatRepository.findByShowtimeIdAndSeatIdentifier(showtimeId, seatId)
                .orElseThrow(() -> {
                    log.warn("Seat {} not found for showtime {} during lock attempt.", seatId, showtimeId);
                    return new BookingException("Seat " + seatId + " does not exist for this showtime. Please refresh seat selection.", showtimeId);
                });

            if (seat.getStatus() == SeatStatus.AVAILABLE) {
                try {
                    seat.setStatus(SeatStatus.SELECTED_TEMP);
                    seat.setUserId(userId);
                    seat.setLockedUntil(lockExpiryTime);
                    showtimeSeatRepository.save(seat); // Optimistic lock check happens here
                    successfullyLockedSeats.add(seat);
                    log.info("Successfully locked seat: {} for showtime {} by user {}", seatId, showtimeId, userId);
                } catch (OptimisticLockException ole) {
                    log.warn("Optimistic lock failed for seat {} on showtime {}. Seat modified concurrently.", seatId, showtimeId, ole);
                    throw new BookingException("Seat " + seatId + " was booked by another user while you were selecting. Please try again.", showtimeId);
                }
            } else {
                log.warn("Seat {} for showtime {} is not available for locking. Current status: {}", seatId, showtimeId, seat.getStatus());
                throw new BookingException("Seat " + seatId + " is no longer available. Current status: " + seat.getStatus(), showtimeId);
            }
        }
        return successfullyLockedSeats;
    }

    private void updateSeatsForPendingPayment(List<ShowtimeSeat> seats, Long bookingId, String userId) {
        LocalDateTime lockExpiryTime = LocalDateTime.now().plusMinutes(SEAT_LOCK_DURATION_MINUTES);
        for (ShowtimeSeat seat : seats) {
            ShowtimeSeat freshSeat = showtimeSeatRepository.findById(seat.getId()) // Re-fetch to ensure working with latest version
                .orElseThrow(() -> new BookingException("Seat with id " + seat.getId() + " not found during PENDING_PAYMENT update for booking " + bookingId, bookingId));

            if (freshSeat.getStatus() != SeatStatus.SELECTED_TEMP || !userId.equals(freshSeat.getUserId())) {
                log.error("Seat {} for showtime {} (booking {}) was not in expected state (SELECTED_TEMP by user {}) for PENDING_PAYMENT update. Current status: {}, current user: {}",
                           freshSeat.getSeatIdentifier(), freshSeat.getShowtimeId(), bookingId, userId, freshSeat.getStatus(), freshSeat.getUserId());
                throw new BookingException("Seat " + freshSeat.getSeatIdentifier() + " state changed unexpectedly. Please retry booking.", bookingId);
            }
            freshSeat.setStatus(SeatStatus.PENDING_PAYMENT);
            freshSeat.setBookingId(bookingId);
            freshSeat.setLockedUntil(lockExpiryTime); // Extend lock during payment
            showtimeSeatRepository.save(freshSeat);
        }
        log.info("Updated {} seats to PENDING_PAYMENT for bookingId {}", seats.size(), bookingId);
    }

    private void confirmSeatsAsBooked(List<ShowtimeSeat> seats, Long bookingId) {
        for (ShowtimeSeat seat : seats) {
            ShowtimeSeat freshSeat = showtimeSeatRepository.findById(seat.getId())
                .orElseThrow(() -> new BookingException("Seat with id " + seat.getId() + " not found during BOOKED confirmation for booking " + bookingId, bookingId));

            if (freshSeat.getStatus() != SeatStatus.PENDING_PAYMENT || !bookingId.equals(freshSeat.getBookingId())) {
                log.error("CRITICAL: Seat {} (booking {}) was not PENDING_PAYMENT for this booking during confirmation. Current status: {}, current bookingId: {}. Payment might have processed for an invalid seat state!",
                           freshSeat.getSeatIdentifier(), bookingId, freshSeat.getStatus(), freshSeat.getBookingId());
                throw new BookingException("Seat " + freshSeat.getSeatIdentifier() + " state was inconsistent during booking confirmation. Please contact support.", bookingId);
            }
            freshSeat.setStatus(SeatStatus.BOOKED);
            freshSeat.setLockedUntil(null); // Remove lock expiry
            freshSeat.setUserId(null); // User associated via booking, not directly on seat once booked. Or keep for audit.
            showtimeSeatRepository.save(freshSeat);
        }
        log.info("Confirmed {} seats as BOOKED for bookingId {}", seats.size(), bookingId);
    }

    private void releaseSeats(List<ShowtimeSeat> seatsToRelease, String reason) {
        if (seatsToRelease == null || seatsToRelease.isEmpty()) {
            return;
        }
        log.warn("Attempting to release {} seats. Reason: {}", seatsToRelease.size(), reason);
        for (ShowtimeSeat seatToRelease : seatsToRelease) {
            if (seatToRelease.getId() == null) {
                log.warn("Skipping release for a seat without an ID (likely not persisted or detached): {}", seatToRelease);
                continue;
            }
            // Re-fetch the seat to ensure we have the latest state before modifying
            showtimeSeatRepository.findById(seatToRelease.getId()).ifPresent(currentSeat -> {
                // Only release if it's still in a temporary or pending state related to this flow
                if (currentSeat.getStatus() == SeatStatus.SELECTED_TEMP || currentSeat.getStatus() == SeatStatus.PENDING_PAYMENT) {
                    log.info("Releasing seat: id={}, identifier={}, showtimeId={}, oldStatus={}, userId={}, bookingId={}. Reason: {}",
                             currentSeat.getId(), currentSeat.getSeatIdentifier(), currentSeat.getShowtimeId(),
                             currentSeat.getStatus(), currentSeat.getUserId(), currentSeat.getBookingId(), reason);
                    currentSeat.setStatus(SeatStatus.AVAILABLE);
                    currentSeat.setUserId(null);
                    currentSeat.setBookingId(null);
                    currentSeat.setLockedUntil(null);
                    showtimeSeatRepository.save(currentSeat);
                } else {
                    log.warn("Seat id={}, identifier={}, showtimeId={} was not in an expected state ({}/{}) for release. Current status: {}. Not releasing.",
                             currentSeat.getId(), currentSeat.getSeatIdentifier(), currentSeat.getShowtimeId(),
                             SeatStatus.SELECTED_TEMP, SeatStatus.PENDING_PAYMENT, currentSeat.getStatus());
                }
            });
        }
    }

    private ShowtimeDto getShowtimeDetails(Long showtimeId) {
        log.debug("Fetching showtime details for id: {}", showtimeId);
        try {
            ResponseEntity<ShowtimeDto> response = movieCatalogClient.getShowtimeById(showtimeId);
            if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
                log.error("Failed to fetch showtime details for id: {}. Status: {}", showtimeId, response.getStatusCode());
                if (response.getStatusCode().value() == 404) {
                    throw new ResourceNotFoundException("Showtime", "id", showtimeId);
                }
                throw new BookingException("Could not retrieve showtime details from catalog service.", showtimeId);
            }
            ShowtimeDto dto = response.getBody();
            if (dto.getMovie() == null || dto.getTheater() == null || dto.getPrice() == null) {
                 log.error("Incomplete showtime details received for id: {}. Movie, Theater, or Price might be null.", showtimeId);
                 throw new BookingException("Incomplete showtime details (Movie, Theater, or Price missing).", showtimeId);
            }
            log.debug("Successfully fetched showtime details for id: {}", showtimeId);
            return dto;
        } catch (MovieCatalogClient.ServiceUnavailableException | CallNotPermittedException e) {
            log.error("Movie Catalog Service unavailable or circuit breaker open for showtimeId {}: {}", showtimeId, e.getMessage());
            throw new BookingException("Movie Catalog Service is currently unavailable. Please try again later.", showtimeId, e);
        } catch (FeignException e) {
            log.error("Feign error fetching showtime details for id: {}. Status: {}", showtimeId, e.status(), e);
            if (e.status() == 404) {
                throw new ResourceNotFoundException("Showtime", "id", showtimeId);
            }
            throw new BookingException("Error communicating with Movie Catalog Service.", showtimeId, e);
        } catch (Exception e) { // Catch any other unexpected exceptions
            log.error("Unexpected error fetching showtime details for id: {}", showtimeId, e);
            throw new BookingException("An unexpected error occurred while fetching showtime details.", showtimeId, e);
        }
    }

    private void validateShowtimeForBooking(ShowtimeDto showtimeDto) {
         if (showtimeDto.getShowtime().isBefore(LocalDateTime.now())) {
            log.warn("Attempted booking for past showtime id: {}, time: {}", showtimeDto.getId(), showtimeDto.getShowtime());
            throw new BookingException("Cannot book for a showtime that has already passed.", showtimeDto.getId());
        }
        // Add other validations, e.g., if showtime is marked as "cancelled" in catalog.
    }

    private PaymentResponseDto processPayment(Booking booking) {
        log.info("Initiating payment process for booking id: {}", booking.getId());
        PaymentRequestDto paymentRequest = PaymentRequestDto.builder()
                .bookingId(booking.getId())
                .userId(booking.getUserId())
                .amount(booking.getTotalPrice())
                .currency("INR") // Assuming INR, make configurable if needed
                .paymentMethodNonce("fake-card-nonce") // Placeholder for actual payment gateway nonce
                .build();
        try {
             ResponseEntity<PaymentResponseDto> response = paymentClient.createCheckoutSession(paymentRequest);
             if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
                  log.error("Payment processing failed for booking id: {}. Status: {}", booking.getId(), response.getStatusCode());
                   return PaymentResponseDto.builder()
                            .bookingId(booking.getId())
                            .status(PaymentResponseDto.PaymentStatus.FAILED)
                            .message("Payment processing failed with status: " + response.getStatusCode())
                            .build();
             }
             PaymentResponseDto paymentResponse = response.getBody();
             log.info("Payment response for booking id: {}. Status: {}, TransactionId: {}",
                      booking.getId(), paymentResponse.getStatus(), paymentResponse.getTransactionId());
             return paymentResponse;
        } catch (PaymentClient.PaymentFallback.ServiceUnavailableException | CallNotPermittedException e) {
            log.error("Payment Service unavailable or circuit breaker open for booking {}: {}", booking.getId(), e.getMessage());
            return PaymentResponseDto.builder()
                      .bookingId(booking.getId())
                      .status(PaymentResponseDto.PaymentStatus.FAILED)
                      .message("Payment service is currently unavailable. Please try again later.")
                      .build();
        } catch (FeignException e) {
            log.error("Feign error during payment processing for booking id: {}. Status: {}", booking.getId(), e.status(), e);
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

    public BookingResponseDto getBookingById(Long id, String userId) {
        log.info("Fetching booking by id: {} for user: {}", id, userId);
        Booking booking = bookingRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id " + id + " for user " + userId, null));
        return convertToDto(booking);
    }

    public List<BookingResponseDto> getBookingsByUserId(String userId) {
        log.info("Fetching all bookings for user: {}", userId);
        List<Booking> bookings = bookingRepository.findByUserIdOrderByBookingTimeDesc(userId);
        return bookings.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public BookingResponseDto cancelBooking(Long bookingId, String userId) {
        log.warn("User {} attempting cancellation for booking id: {}", userId, bookingId);
        Booking booking = bookingRepository.findByIdAndUserId(bookingId, userId)
                 .orElseThrow(() -> new ResourceNotFoundException("Booking", "id " + bookingId + " for user " + userId, null));

        if (booking.getStatus() != BookingStatus.CONFIRMED && booking.getStatus() != BookingStatus.PENDING_PAYMENT) {
            log.warn("Booking {} cannot be cancelled. Status is: {}", bookingId, booking.getStatus());
            throw new BookingException("Booking cannot be cancelled as it is not in CONFIRMED state.", bookingId);
        }
        // Example cancellation policy: Not allowed if showtime is within 2 hours
        if (booking.getShowtimeDateTime() != null && booking.getShowtimeDateTime().isBefore(LocalDateTime.now().plusHours(2))) {
            log.warn("Booking {} cancellation rejected: Too close to showtime ({}).", bookingId, booking.getShowtimeDateTime());
            throw new BookingException("Booking cannot be cancelled this close to the showtime (less than 2 hours).", bookingId);
        }

        // Simulate refund process
        log.info("Initiating refund for booking id: {}", bookingId);
        boolean refundSuccessful = simulateRefund(booking); // Placeholder for actual refund logic

        if (refundSuccessful) {
            List<ShowtimeSeat> seatsToRelease = showtimeSeatRepository.findAllByBookingId(bookingId);
            releaseSeats(seatsToRelease, "Booking cancellation for bookingId: " + bookingId);
            booking.setStatus(BookingStatus.CANCELLED);
            log.info("Booking id: {} cancelled successfully by user {}.", bookingId, userId);
        } else {
            log.error("Refund failed for booking id: {}. Booking not cancelled.", bookingId);
            // Depending on policy, if refund fails, booking might not be cancelled.
            throw new BookingException("Cancellation failed: Could not process refund at this time.", bookingId);
        }

        Booking updatedBooking = bookingRepository.save(booking);
        return convertToDto(updatedBooking);
    }

    private boolean simulateRefund(Booking booking) {
        // Placeholder for actual refund logic with a payment gateway
        log.info("Simulating refund for booking id: {}, amount: {}", booking.getId(), booking.getTotalPrice());
        // In a real system, interact with paymentClient to process refund
        return true; // Assume refund is successful for now
    }

    @Transactional
    public void cleanupExpiredSeatLocks() {
        LocalDateTime cutoffTime = LocalDateTime.now().minusMinutes(SEAT_LOCK_DURATION_MINUTES + 2); // Add a small buffer
        log.debug("Running cleanup for seat locks expired before: {}", cutoffTime);

        List<ShowtimeSeat> expiredTempSeats = showtimeSeatRepository.findAllByStatusAndLockedUntilBefore(SeatStatus.SELECTED_TEMP, cutoffTime);
        if (!expiredTempSeats.isEmpty()) {
            log.info("Found {} expired SELECTED_TEMP seats to clean up.", expiredTempSeats.size());
            releaseSeats(expiredTempSeats, "Expired SELECTED_TEMP lock cleanup job.");
        }

        List<ShowtimeSeat> expiredPendingSeats = showtimeSeatRepository.findAllByStatusAndLockedUntilBefore(SeatStatus.PENDING_PAYMENT, cutoffTime);
        if (!expiredPendingSeats.isEmpty()) {
            log.info("Found {} expired PENDING_PAYMENT seats to clean up.", expiredPendingSeats.size());
            for (ShowtimeSeat seat : expiredPendingSeats) {
                if (seat.getBookingId() != null) {
                    bookingRepository.findById(seat.getBookingId()).ifPresent(booking -> {
                        if (booking.getStatus() == BookingStatus.PENDING_PAYMENT) {
                            log.warn("Updating booking {} to PAYMENT_FAILED due to expired seat lock for seat id {}",
                                     booking.getId(), seat.getId());
                            booking.setStatus(BookingStatus.PAYMENT_FAILED);
                            bookingRepository.save(booking);
                        }
                    });
                }
            }
            releaseSeats(expiredPendingSeats, "Expired PENDING_PAYMENT lock cleanup job.");
        }
        log.debug("Seat lock cleanup job finished.");
    }

    private BookingResponseDto convertToDto(Booking booking) {
        if (booking == null) return null;
        return BookingResponseDto.builder()
                .id(booking.getId())
                .userId(booking.getUserId())
                .showtimeId(booking.getShowtimeId())
                .movieId(booking.getMovieId())
                .theaterId(booking.getTheaterId())
                .numberOfSeats(booking.getNumberOfSeats()) // Derived from selectedSeats.size()
                .selectedSeats(booking.getSelectedSeats())
                .totalPrice(booking.getTotalPrice())
                .bookingTime(booking.getBookingTime())
                .status(booking.getStatus())
                .paymentTransactionId(booking.getPaymentTransactionId())
                .movieTitle(booking.getMovieTitle())
                .theaterName(booking.getTheaterName())
                .showtimeDateTime(booking.getShowtimeDateTime())
                .build();
    }
}