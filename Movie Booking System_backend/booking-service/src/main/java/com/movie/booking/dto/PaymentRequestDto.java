package com.movie.booking.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

// DTO sent TO Payment Service
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequestDto {
    @NotNull
    private Long bookingId; // Link payment to booking
    @NotBlank
    private String userId;
    @NotNull @Positive
    private BigDecimal amount;
    @NotBlank
    private String currency; // e.g., "USD", "INR"
    // Add payment method details (e.g., card token, etc.) - simplified for now
    private String paymentMethodNonce; // Example field
}