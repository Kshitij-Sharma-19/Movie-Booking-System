package com.movie.booking.client;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import com.movie.booking.dto.ShowtimeDto;

// Value should match the spring.application.name of the target service in Eureka
@FeignClient(name = "movie-catalog-service", fallback = MovieCatalogClient.MovieCatalogFallback.class)
public interface MovieCatalogClient {

    // Matches the endpoint in Movie Catalog Service's ShowtimeController
    @GetMapping("/api/v1/showtimes/{id}")
    @CircuitBreaker(name = "movie-catalog-service") // Apply circuit breaker config by name
    @Retry(name = "movie-catalog-service") // Optional: Apply retry config
    ResponseEntity<ShowtimeDto> getShowtimeById(@PathVariable("id") Long id);

    // Matches the endpoint in Movie Catalog Service's ShowtimeController
    @PatchMapping("/api/v1/showtimes/{id}/decreaseSeats")
    @CircuitBreaker(name = "movie-catalog-service")
    // No retry usually for non-idempotent actions like decreasing seats
    ResponseEntity<Void> decreaseSeats(@PathVariable("id") Long id, @RequestParam("count") int count);

    // Matches the endpoint in Movie Catalog Service's ShowtimeController
    @PatchMapping("/api/v1/showtimes/{id}/increaseSeats")
    @CircuitBreaker(name = "movie-catalog-service")
    // No retry usually for non-idempotent actions
    ResponseEntity<Void> increaseSeats(@PathVariable("id") Long id, @RequestParam("count") int count);


    // --- Fallback Implementation ---
    @Component
    @Slf4j
    class MovieCatalogFallback implements MovieCatalogClient {

        @Override
        public ResponseEntity<ShowtimeDto> getShowtimeById(Long id) {
            log.error("Fallback: Could not get showtime by id: {}", id);
            // Return an appropriate error response or default DTO
            // Returning null or empty might cause NPEs downstream, consider a specific error response
            // Or throw a custom exception that the service layer can catch
             throw new ServiceUnavailableException("Movie Catalog Service unavailable (getShowtimeById)");
           // return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(null); // Example: return 503
        }

        @Override
        public ResponseEntity<Void> decreaseSeats(Long id, int count) {
            log.error("Fallback: Could not decrease seats for showtime id: {}", id);
             throw new ServiceUnavailableException("Movie Catalog Service unavailable (decreaseSeats)");
            // return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).build();
        }

        @Override
        public ResponseEntity<Void> increaseSeats(Long id, int count) {
            log.error("Fallback: Could not increase seats for showtime id: {}", id);
             throw new ServiceUnavailableException("Movie Catalog Service unavailable (increaseSeats)");
            // return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).build();
        }
    }

     // Custom exception for fallback methods
    class ServiceUnavailableException extends RuntimeException {
        public ServiceUnavailableException(String message) {
            super(message);
        }
    }
}