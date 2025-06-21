package com.movie.payment.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.movie.payment.dto.PaymentRequestDto;
import com.movie.payment.dto.PaymentResponseDto;

import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;
import java.util.concurrent.TimeUnit;

@Service
@Slf4j
public class PaymentSimulationService {

    @Value("${payment.simulation.successRate:0.95}")
    private double successRate;

    @Value("${payment.simulation.processingTimeMs:500}")
    private long processingTimeMs;

    public PaymentResponseDto processPayment(PaymentRequestDto request) {
        log.info("Processing payment for booking id: {}, amount: {} {}",
                 request.getBookingId(), request.getAmount(), request.getCurrency());

        // Simulate processing time
        try {
            TimeUnit.MILLISECONDS.sleep(processingTimeMs);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            log.error("Payment processing interrupted for booking id: {}", request.getBookingId(), e);
             return PaymentResponseDto.builder()
                    .bookingId(request.getBookingId())
                    .status(PaymentResponseDto.PaymentStatus.FAILED)
                    .message("Payment processing interrupted.")
                    .build();
        }

        // Simulate success or failure
        boolean success = ThreadLocalRandom.current().nextDouble() < successRate;

        if (success) {
            String transactionId = UUID.randomUUID().toString();
            log.info("Payment SUCCEEDED for booking id: {}. Transaction ID: {}", request.getBookingId(), transactionId);
            return PaymentResponseDto.builder()
                    .bookingId(request.getBookingId())
                    .status(PaymentResponseDto.PaymentStatus.SUCCEEDED)
                    .transactionId(transactionId)
                    .message("Payment processed successfully.")
                    .build();
        } else {
            log.warn("Payment FAILED for booking id: {}", request.getBookingId());
            return PaymentResponseDto.builder()
                    .bookingId(request.getBookingId())
                    .status(PaymentResponseDto.PaymentStatus.FAILED)
                    .message("Payment declined (simulated failure).")
                    .build();
        }
    }

     // TODO: Add refund simulation if needed
     // public RefundResponseDto processRefund(...) { ... }
}