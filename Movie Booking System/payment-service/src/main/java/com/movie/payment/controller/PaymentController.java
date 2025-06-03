package com.movie.payment.controller;

import com.movie.payment.dto.PaymentRequestDto;
import com.movie.payment.dto.PaymentResponseDto;
import com.movie.payment.service.StripePaymentService; // Updated import

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
@Tag(name = "Payment Processing", description = "API for handling payment requests with Stripe")
public class PaymentController {

    private final StripePaymentService paymentService; // Use StripePaymentService

    @PostMapping("/process")
    @Operation(summary = "Process a payment via Stripe",
               description = "Processes a payment request using Stripe PaymentIntents. Requires authentication.",
               security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponse(responseCode = "200", description = "Payment processed (status SUCCEEDED, FAILED, or PENDING)")
    @ApiResponse(responseCode = "400", description = "Invalid payment request")
    @ApiResponse(responseCode = "401", description = "Unauthorized")
    @ApiResponse(responseCode = "403", description = "Forbidden")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PaymentResponseDto> processPayment(@Valid @RequestBody PaymentRequestDto request) {
        PaymentResponseDto response = paymentService.processPayment(request);
        // Consider returning different HTTP status codes based on response.getStatus()
        // For example, HttpStatus.ACCEPTED for PENDING, HttpStatus.BAD_REQUEST for FAILED if it's a client error.
        // However, returning 200 OK and indicating status in the body is also common.
        return ResponseEntity.ok(response);
    }

    // TODO: Add refund endpoint if needed, calling StripePaymentService.processRefund(...)
    // @PostMapping("/refund") ...
}