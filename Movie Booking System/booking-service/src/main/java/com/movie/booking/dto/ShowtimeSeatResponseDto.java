package com.movie.booking.dto;

import com.movie.booking.model.SeatStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShowtimeSeatResponseDto {
    private Long id;
    private String seatIdentifier;
    private SeatStatus status;
    private String userId; // User who has it locked/booked (if applicable)
    // Potentially add row/column if you parse/store them separately for UI convenience
}