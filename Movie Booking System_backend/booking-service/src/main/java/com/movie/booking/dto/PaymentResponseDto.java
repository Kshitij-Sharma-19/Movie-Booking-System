package com.movie.booking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponseDto {
    private Long bookingId;
    private PaymentStatus status; // e.g., SUCCEEDED, FAILED, PENDING
    private String transactionId; // Payment gateway transaction ID
    private String message; // Optional message (e.g., error details)
    private String redirectUrl; // <--- add this
    private String clientSecret; // optional: for 3DS etc.

    public enum PaymentStatus {
        SUCCEEDED, FAILED, PENDING
    }
}