package com.movie.payment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequestDto {
    @NotNull
    private Long bookingId;
    @NotBlank
    private String userId;
    @NotNull @Positive
    private BigDecimal amount;
    @NotBlank
    private String currency;
    private String paymentMethodNonce; // Example field
}