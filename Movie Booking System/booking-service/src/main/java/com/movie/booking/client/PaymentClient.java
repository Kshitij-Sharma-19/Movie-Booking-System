package com.movie.booking.client;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.movie.booking.dto.PaymentRequestDto;
import com.movie.booking.dto.PaymentResponseDto;


// Assuming payment service is named "payment-service" in Eureka
@FeignClient(name = "payment-service", fallback = PaymentClient.PaymentFallback.class)
public interface PaymentClient {

    // Define the endpoint expected on the Payment Service
    @PostMapping("/api/v1/payments/process") // Example endpoint
    @CircuitBreaker(name = "payment-service")
    // Retry might be risky for payments unless the payment service handles idempotency well
    ResponseEntity<PaymentResponseDto> processPayment(@RequestBody PaymentRequestDto paymentRequest);

    // TODO: Define refund endpoint if cancellation is implemented
    // @PostMapping("/api/v1/payments/refund")
    // ResponseEntity<PaymentResponseDto> refundPayment(@RequestBody RefundRequestDto refundRequest);

    // --- Fallback Implementation ---
    @Component
    @Slf4j
    class PaymentFallback implements PaymentClient {

        @Override
        public ResponseEntity<PaymentResponseDto> processPayment(PaymentRequestDto paymentRequest) {
            log.error("Fallback: Payment service unavailable for booking id: {}", paymentRequest.getBookingId());
             // Return a FAILED status immediately or throw custom exception
             PaymentResponseDto fallbackResponse = PaymentResponseDto.builder()
                    .bookingId(paymentRequest.getBookingId())
                    .status(PaymentResponseDto.PaymentStatus.FAILED)
                    .message("Payment service unavailable. Please try again later.")
                    .build();
            // Returning a failed response allows the booking service to handle it gracefully
            return ResponseEntity.status(503).body(fallbackResponse);
             // Or throw exception:
             // throw new MovieCatalogClient.ServiceUnavailableException("Payment Service unavailable (processPayment)");
        }

         // TODO: Implement fallback for refund
    }
}