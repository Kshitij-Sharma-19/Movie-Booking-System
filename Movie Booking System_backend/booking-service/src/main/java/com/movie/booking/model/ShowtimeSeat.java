package com.movie.booking.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "showtime_seats") // uniqueConstraints and indexes removed
public class ShowtimeSeat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Showtime ID cannot be null")
    @Column(nullable = false)
    private Long showtimeId;

    @NotBlank(message = "Seat identifier cannot be blank")
    @Column(nullable = false, length = 10)
    private String seatIdentifier;

    @NotNull(message = "Seat status cannot be null")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SeatStatus status;

    @Column(nullable = true)
    private String userId;

    @Column(nullable = true)
    private Long bookingId;

    @Column(nullable = true)
    private LocalDateTime lockedUntil;

    @Version
    private Long version;
}