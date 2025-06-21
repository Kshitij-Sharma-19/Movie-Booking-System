package com.movie.payment.service;

import java.math.BigDecimal;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.movie.payment.dto.PaymentRequestDto;
import com.movie.payment.dto.PaymentResponseDto;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class StripePaymentService {

    @Value("${stripe.secret.key}")
    private String stripeSecretKey;

    @Value("${app.frontend.url:http://localhost:3000}")
    private String frontendUrl;

    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeSecretKey;
    }

    public PaymentResponseDto processPayment(PaymentRequestDto request) {
        log.info("Processing Stripe payment for booking id: {}, amount: {} {}, incoming stripePaymentMethodId: {}",
                request.getBookingId(), request.getAmount(), request.getCurrency(), request.getStripePaymentMethodId());

        try {
            long amountInCents = request.getAmount().multiply(new BigDecimal(100)).longValueExact();

            String paymentMethodIdToUse = request.getStripePaymentMethodId();

            // For demo purposes, use test payment method if none provided
            if (paymentMethodIdToUse == null || paymentMethodIdToUse.trim().isEmpty() || "fake-card-nonce".equalsIgnoreCase(paymentMethodIdToUse)) {
                log.warn("No valid Stripe PaymentMethod ID provided for booking id: {}. Using default test card 'pm_card_visa' for demo.", request.getBookingId());
                paymentMethodIdToUse = "pm_card_visa";
            }

            // Configure success and cancel URLs
            String successUrl = frontendUrl + "/payment/success?booking_id=" + request.getBookingId();
            String cancelUrl = frontendUrl + "/payment/cancel?booking_id=" + request.getBookingId();

            PaymentIntentCreateParams.Builder paramsBuilder =
                    PaymentIntentCreateParams.builder()
                            .setAmount(amountInCents)
                            .setCurrency(request.getCurrency().toLowerCase())
                            .setPaymentMethod(paymentMethodIdToUse)
                            .setConfirm(true)
                            .setReturnUrl(successUrl) // This is used for 3DS and other redirect flows
                            .setConfirmationMethod(PaymentIntentCreateParams.ConfirmationMethod.AUTOMATIC);

            // Add metadata for tracking
            paramsBuilder.putMetadata("booking_id", request.getBookingId().toString());
            paramsBuilder.putMetadata("success_url", successUrl);
            paramsBuilder.putMetadata("cancel_url", cancelUrl);

            PaymentIntentCreateParams params = paramsBuilder.build();

            log.debug("Creating PaymentIntent with params: amount={}, currency={}, payment_method={}, confirm=true, return_url={}",
                params.getAmount(), params.getCurrency(), params.getPaymentMethod(), successUrl);

            PaymentIntent paymentIntent = PaymentIntent.create(params);

            log.info("PaymentIntent created for booking id: {}. PaymentIntent ID: {}, Status: {}",
                     request.getBookingId(), paymentIntent.getId(), paymentIntent.getStatus());

            if ("succeeded".equals(paymentIntent.getStatus())) {
                log.info("Stripe Payment SUCCEEDED for booking id: {}. PaymentIntent ID: {}",
                        request.getBookingId(), paymentIntent.getId());

                return PaymentResponseDto.builder()
                        .bookingId(request.getBookingId())
                        .status(PaymentResponseDto.PaymentStatus.SUCCEEDED)
                        .transactionId(paymentIntent.getId())
                        .message("Payment processed successfully via Stripe.")
                        .redirectUrl(successUrl) // Include redirect URL in response
                        .build();
            } else if ("requires_action".equals(paymentIntent.getStatus())) {
                log.warn("Stripe Payment requires further action for booking id: {}. PaymentIntent ID: {}. Client Secret: {}",
                         request.getBookingId(), paymentIntent.getId(), paymentIntent.getClientSecret());
                
                return PaymentResponseDto.builder()
                        .bookingId(request.getBookingId())
                        .status(PaymentResponseDto.PaymentStatus.PENDING)
                        .transactionId(paymentIntent.getId())
                        .clientSecret(paymentIntent.getClientSecret()) // Frontend needs this for 3DS
                        .message("Payment requires additional authentication.")
                        .build();
            } else {
                log.warn("Stripe Payment status is '{}' for booking id: {}. PaymentIntent ID: {}",
                         paymentIntent.getStatus(), request.getBookingId(), paymentIntent.getId());
                return PaymentResponseDto.builder()
                        .bookingId(request.getBookingId())
                        .status(PaymentResponseDto.PaymentStatus.FAILED)
                        .transactionId(paymentIntent.getId())
                        .message("Payment status on Stripe: " + paymentIntent.getStatus())
                        .redirectUrl(cancelUrl) // Redirect to cancel page on failure
                        .build();
            }

        } catch (StripeException e) {
            log.error("Stripe API error for booking id: {}: {}", request.getBookingId(), e.getMessage(), e);
            return PaymentResponseDto.builder()
                    .bookingId(request.getBookingId())
                    .status(PaymentResponseDto.PaymentStatus.FAILED)
                    .message("Stripe API error: " + e.getMessage())
                    .redirectUrl(frontendUrl + "/payment/cancel?booking_id=" + request.getBookingId())
                    .build();
        } catch (Exception e) {
            log.error("Unexpected error during payment processing for booking id: {}", request.getBookingId(), e);
            return PaymentResponseDto.builder()
                    .bookingId(request.getBookingId())
                    .status(PaymentResponseDto.PaymentStatus.FAILED)
                    .message("Unexpected error during payment processing.")
                    .redirectUrl(frontendUrl + "/payment/cancel?booking_id=" + request.getBookingId())
                    .build();
        }
    }

  
}