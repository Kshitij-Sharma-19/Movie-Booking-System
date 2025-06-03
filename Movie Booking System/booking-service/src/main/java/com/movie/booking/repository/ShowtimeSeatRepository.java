package com.movie.booking.repository;

import com.movie.booking.model.SeatStatus;
import com.movie.booking.model.ShowtimeSeat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import jakarta.persistence.LockModeType;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ShowtimeSeatRepository extends JpaRepository<ShowtimeSeat, Long> {

    Optional<ShowtimeSeat> findByShowtimeIdAndSeatIdentifier(Long showtimeId, String seatIdentifier);

    List<ShowtimeSeat> findAllByShowtimeIdAndSeatIdentifierIn(Long showtimeId, List<String> seatIdentifiers);

    List<ShowtimeSeat> findAllByBookingId(Long bookingId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT s FROM ShowtimeSeat s WHERE s.showtimeId = :showtimeId AND s.seatIdentifier = :seatIdentifier")
    Optional<ShowtimeSeat> findByShowtimeIdAndSeatIdentifierWithLock(@Param("showtimeId") Long showtimeId, @Param("seatIdentifier") String seatIdentifier);

    List<ShowtimeSeat> findAllByStatusAndLockedUntilBefore(SeatStatus status, LocalDateTime cutoffTime);

    // Modified to fetch ALL seats for a showtimeId regardless of status for the layout view
    List<ShowtimeSeat> findAllByShowtimeId(Long showtimeId); // MODIFIED/SIMPLIFIED

    // Count seats for a showtimeId (used in initialization logic)
    long countByShowtimeId(Long showtimeId); // NEW METHOD
    
    long deleteByShowtimeId(Long showtimeId);
}