package com.movie.booking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

// DTO received FROM Payment Service
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponseDto {
    private Long bookingId;
    private PaymentStatus status; // e.g., SUCCEEDED, FAILED
    private String transactionId; // Payment gateway transaction ID
    private String message; // Optional message (e.g., error details)

    public enum PaymentStatus {
        SUCCEEDED, FAILED, PENDING
    }
}