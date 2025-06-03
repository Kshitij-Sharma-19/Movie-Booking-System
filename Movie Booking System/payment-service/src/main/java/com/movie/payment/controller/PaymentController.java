package com.movie.payment.controller;

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

import com.movie.payment.dto.PaymentRequestDto;
import com.movie.payment.dto.PaymentResponseDto;
import com.movie.payment.service.PaymentSimulationService;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
@Tag(name = "Payment Processing", description = "API for handling payment requests (Simulated)")
public class PaymentController {

    private final PaymentSimulationService paymentService;

    @PostMapping("/process")
    @Operation(summary = "Process a payment", description = "Simulates processing a payment request. Requires authentication (e.g., called by Booking Service).",
               security = @SecurityRequirement(name = "bearerAuth")) // Indicate endpoint requires auth
    @ApiResponse(responseCode = "200", description = "Payment processed (status SUCCEEDED or FAILED)")
    @ApiResponse(responseCode = "400", description = "Invalid payment request")
    @ApiResponse(responseCode = "401", description = "Unauthorized")
    @ApiResponse(responseCode = "403", description = "Forbidden")
    // Secure this endpoint - assuming only internal services (like booking) should call it.
    // This could use scope-based authorization (e.g., hasAuthority('SCOPE_INTERNAL_SERVICE'))
    // or just rely on authenticated() if all internal calls have valid JWTs.
    @PreAuthorize("isAuthenticated()") // Basic check: Must be called by an authenticated service/user
    public ResponseEntity<PaymentResponseDto> processPayment(@Valid @RequestBody PaymentRequestDto request) {
        PaymentResponseDto response = paymentService.processPayment(request);
        // Always return 200 OK, the status is in the response body
        return ResponseEntity.ok(response);
    }

    // TODO: Add refund endpoint if needed
    // @PostMapping("/refund") ...
}