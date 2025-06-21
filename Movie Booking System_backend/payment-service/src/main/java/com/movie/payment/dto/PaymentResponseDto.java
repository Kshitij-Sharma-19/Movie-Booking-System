package com.movie.payment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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
    private String message;       // Optional message (e.g., error details)
    private String redirectUrl;   // Stripe redirect link for further action (e.g., 3DS)
    private String clientSecret;  // Stripe client secret for frontend 3DS handling

    public enum PaymentStatus {
        SUCCEEDED, FAILED, PENDING
    }
}