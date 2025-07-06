package com.movie.moviecatalogservice.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.movie.moviecatalogservice.dto.ShowtimeDto;
import com.movie.moviecatalogservice.service.ShowtimeService;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/showtimes")
@RequiredArgsConstructor
@Tag(name = "Showtime Management", description = "APIs for managing movie showtimes")
public class ShowtimeController {

    private final ShowtimeService showtimeService;

    // Public endpoint to find showtimes for a movie in a city on a specific date
    @GetMapping("/search")
    @Operation(summary = "Search showtimes", description = "Finds showtimes for a given movie ID, city, and date.")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved showtimes")
    @ApiResponse(responseCode = "404", description = "Movie not found")
    public ResponseEntity<List<ShowtimeDto>> findShowtimes(
            @Parameter(description = "ID of the movie", required = true) @RequestParam Long movieId,
            @Parameter(description = "City name", required = true) @RequestParam String city,
            @Parameter(description = "Date (YYYY-MM-DD)", required = true) @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(showtimeService.getShowtimesByMovieAndCityForDate(movieId, city, date));
    }
    
    // Public endpoint to search showtime of movies by name, city, and date
    @GetMapping("/movie/search")
    @Operation(summary = "Search movies", description = "Finds movies by name, city, and showtime date.")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved matching movies")
    @ApiResponse(responseCode = "404", description = "No movies found")
    public ResponseEntity<List<ShowtimeDto>> findMoviesByNameCityAndDate(
            @Parameter(description = "Movie name", required = true) @RequestParam String name,
            @Parameter(description = "City name", required = true) @RequestParam String city,
            @Parameter(description = "Date (YYYY-MM-DD)", required = true) @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        List<ShowtimeDto> movies = showtimeService.getShowtimesByNameCityAndDate(name, city, date);
        if (movies.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.ok(movies);
    }

     @GetMapping("/{id}")
    @Operation(summary = "Get showtime by ID", description = "Retrieves a specific showtime by its ID.")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved showtime")
    @ApiResponse(responseCode = "404", description = "Showtime not found")
    public ResponseEntity<ShowtimeDto> getShowtimeById(
            @Parameter(description = "ID of the showtime to retrieve") @PathVariable Long id) {
        return ResponseEntity.ok(showtimeService.getShowtimeById(id));
    }

    @GetMapping("/movie/{movieId}")
    @Operation(summary = "Get showtimes by Movie ID", description = "Retrieves all showtimes for a specific movie.")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved showtimes")
    @ApiResponse(responseCode = "404", description = "Movie not found")
     public ResponseEntity<List<ShowtimeDto>> getShowtimesByMovieId(
            @Parameter(description = "ID of the movie") @PathVariable Long movieId) {
        return ResponseEntity.ok(showtimeService.getShowtimesByMovieId(movieId));
    }


    // --- Admin Endpoints ---

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Add a new showtime", description = "Adds a new showtime. Requires ADMIN role.",
               security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponse(responseCode = "201", description = "Showtime created successfully")
    @ApiResponse(responseCode = "400", description = "Invalid input (e.g., validation error, seats > capacity)")
    @ApiResponse(responseCode = "404", description = "Movie or Theater not found")
    @ApiResponse(responseCode = "401", description = "Unauthorized")
    @ApiResponse(responseCode = "403", description = "Forbidden")
    public ResponseEntity<ShowtimeDto> addShowtime(@Valid @RequestBody ShowtimeDto showtimeDto) {
        // DTO returned by service now includes nested movie/theater info
        ShowtimeDto createdShowtime = showtimeService.addShowtime(showtimeDto);
        return new ResponseEntity<>(createdShowtime, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update an existing showtime", description = "Updates details of an existing showtime by ID. Requires ADMIN role.",
               security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponse(responseCode = "200", description = "Showtime updated successfully")
    @ApiResponse(responseCode = "400", description = "Invalid input")
    @ApiResponse(responseCode = "404", description = "Showtime, Movie, or Theater not found")
    @ApiResponse(responseCode = "401", description = "Unauthorized")
    @ApiResponse(responseCode = "403", description = "Forbidden")
    public ResponseEntity<ShowtimeDto> updateShowtime(
            @Parameter(description = "ID of the showtime to update") @PathVariable Long id,
            @Valid @RequestBody ShowtimeDto showtimeDto) {
        return ResponseEntity.ok(showtimeService.updateShowtime(id, showtimeDto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete a showtime", description = "Deletes a showtime by ID. Requires ADMIN role.",
               security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponse(responseCode = "204", description = "Showtime deleted successfully")
    @ApiResponse(responseCode = "404", description = "Showtime not found")
    @ApiResponse(responseCode = "401", description = "Unauthorized")
    @ApiResponse(responseCode = "403", description = "Forbidden")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteShowtime(
            @Parameter(description = "ID of the showtime to delete") @PathVariable Long id) {
        showtimeService.deleteShowtime(id);
    }

}