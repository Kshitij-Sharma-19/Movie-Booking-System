package com.movie.booking.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
// import jakarta.validation.constraints.Positive; // Removed as numberOfSeats is removed
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List; // Import List

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(
        name = "bookings",
        indexes = {
            @Index(name = "idx_user_id", columnList = "userId")
        }
    )
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "User ID cannot be null")
    @Column(nullable = false)
    private String userId;

    @NotNull(message = "Showtime ID cannot be null")
    @Column(nullable = false)
    private Long showtimeId;

    @NotNull(message = "Movie ID cannot be null")
    @Column(nullable = false)
    private Long movieId;

    @NotNull(message = "Theater ID cannot be null")
    @Column(nullable = false)
    private Long theaterId;

    // @Positive(message = "Number of seats must be positive") // REMOVED
    // @Column(nullable = false) // REMOVED
    // private Integer numberOfSeats; // REMOVED

    @NotEmpty(message = "Selected seats cannot be empty")
    @ElementCollection(fetch = FetchType.EAGER) // Stores a collection of basic types
    @CollectionTable(name = "booking_selected_seats", joinColumns = @JoinColumn(name = "booking_id"))
    @Column(name = "seat_identifier", nullable = false)
    private List<String> selectedSeats; // ADDED: e.g., ["A1", "A2"]

    @NotNull(message = "Total price cannot be null")
    @Column(nullable = false)
    private BigDecimal totalPrice; // This will be calculated based on selectedSeats.size() * pricePerSeat

    @NotNull(message = "Booking time cannot be null")
    @Column(nullable = false)
    private LocalDateTime bookingTime;

    @NotNull(message = "Booking status cannot be null")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status;

    private String paymentTransactionId;

    private String movieTitle;
    private String theaterName;
    private LocalDateTime showtimeDateTime;

    // Helper method to get the count of selected seats
    // This can be useful if other parts of your application still expect a number of seats,
    // or for calculating the total price.
    @Transient // Ensures this getter is not persisted as a column
    public Integer getNumberOfSeats() {
        return selectedSeats != null ? selectedSeats.size() : 0;
    }
}