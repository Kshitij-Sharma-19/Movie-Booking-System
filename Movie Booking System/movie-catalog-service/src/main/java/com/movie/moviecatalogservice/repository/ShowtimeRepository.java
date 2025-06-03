package com.movie.moviecatalogservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.movie.moviecatalogservice.model.Showtime;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ShowtimeRepository extends JpaRepository<Showtime, Long> {

    // Find showtimes for a specific movie
    List<Showtime> findByMovieId(Long movieId);

    // Find showtimes for a specific theater
    List<Showtime> findByTheaterId(Long theaterId);

    // Find showtimes for a movie in a specific theater
    List<Showtime> findByMovieIdAndTheaterId(Long movieId, Long theaterId);

    // Find showtimes for a movie after a certain time
    List<Showtime> findByMovieIdAndShowtimeAfter(Long movieId, LocalDateTime time);

    // Find showtimes for a movie within a specific time range and city
    @Query("SELECT s FROM Showtime s JOIN s.theater t " +
           "WHERE s.movie.id = :movieId " +
           "AND t.city = :city " +
           "AND s.showtime >= :startTime AND s.showtime < :endTime " +
           "ORDER BY s.showtime")
    List<Showtime> findMovieShowtimesByCityAndTimeRange(
            @Param("movieId") Long movieId,
            @Param("city") String city,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime);

     // Find available showtimes (with seats > 0) for a movie and theater after a certain time
    List<Showtime> findByMovieIdAndTheaterIdAndShowtimeAfterAndAvailableSeatsGreaterThan(
            Long movieId, Long theaterId, LocalDateTime time, Integer minSeats);
}