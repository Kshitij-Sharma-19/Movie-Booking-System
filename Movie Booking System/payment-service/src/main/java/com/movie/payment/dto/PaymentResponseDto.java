package com.movie.payment.dto;

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
    private PaymentStatus status;
    private String transactionId;
    private String message;

    public enum PaymentStatus {
        SUCCEEDED, FAILED, PENDING
    }
}