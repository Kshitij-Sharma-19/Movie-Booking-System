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

    // A placeholder return URL for server-to-server flows or demos
    // Replace with a real URL if you build a frontend that handles redirects
    private static final String DEFAULT_DEMO_RETURN_URL = "https://example.com/payment/return";


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

            // For a "fake card demo", if no paymentMethodId is provided by the client,
            // we can use a default Stripe test card PaymentMethod ID.
            // Common test card PaymentMethod IDs:
            // "pm_card_visa" -> Visa
            // "pm_card_visa_debit" -> Visa Debit
            // "pm_card_mastercard" -> Mastercard
            // "pm_card_amex" -> Amex
            // "pm_card_discover" -> Discover
            // "pm_card_diners" -> Diners
            // "pm_card_jcb" -> JCB
            // "pm_card_unionpay" -> UnionPay
            // For cards that trigger 3D Secure in test mode: "pm_card_visa_chargeDeclined" (will decline), 
            // or use specific card numbers that trigger 3DS.
            if (paymentMethodIdToUse == null || paymentMethodIdToUse.trim().isEmpty() || "fake-card-nonce".equalsIgnoreCase(paymentMethodIdToUse)) {
                log.warn("No valid Stripe PaymentMethod ID provided for booking id: {}. Using default test card 'pm_card_visa' for demo.", request.getBookingId());
                paymentMethodIdToUse = "pm_card_visa"; // Defaulting to a standard Visa test card
            }


            PaymentIntentCreateParams.Builder paramsBuilder =
                    PaymentIntentCreateParams.builder()
                            .setAmount(amountInCents)
                            .setCurrency(request.getCurrency().toLowerCase())
                            .setPaymentMethod(paymentMethodIdToUse) // Use the determined (or default test) payment method
                            .setConfirm(true) // We want to attempt to confirm it immediately
                            .setReturnUrl(DEFAULT_DEMO_RETURN_URL); // Stripe requires this for many flows

            // If you are manually confirming, Stripe recommends 'automatic' unless you have specific reasons.
            // For this server-side confirmation with a test card, 'automatic' is often simpler.
            // If you use MANUAL, you might need to handle 'requires_action' differently.
            // Let's try with AUTOMATIC confirmation method first for simplicity with test cards.
            // If you stick with MANUAL, ensure your test card doesn't require actions you can't handle server-side.
            paramsBuilder.setConfirmationMethod(PaymentIntentCreateParams.ConfirmationMethod.AUTOMATIC);
            // If using AUTOMATIC, you usually don't set setPaymentMethod explicitly if you also use automatic_payment_methods.
            // However, since we are providing a specific payment_method ("pm_card_visa"),
            // and confirming immediately, this setup is for direct charge.

            // Alternative for more dynamic payment methods chosen by Stripe (if not providing a pm_id directly):
            /*
            if (paymentMethodIdToUse == null) { // No specific pm_id from client
                paramsBuilder.setAutomaticPaymentMethods(
                    PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                        .setEnabled(true)
                        // .setAllowRedirects(PaymentIntentCreateParams.AutomaticPaymentMethods.AllowRedirects.NEVER) // If you want to avoid redirects
                        .build()
                );
                // If using automatic_payment_methods, you typically don't set .setPaymentMethod()
                // and the confirmation flow might be different (often client-side driven)
            } else {
                 paramsBuilder.setPaymentMethod(paymentMethodIdToUse);
            }
            */

            PaymentIntentCreateParams params = paramsBuilder.build();

            log.debug("Creating PaymentIntent with params: amount={}, currency={}, payment_method={}, confirm=true, confirmation_method={}, return_url={}",
                params.getAmount(), params.getCurrency(), params.getPaymentMethod(), params.getConfirm(), params.getConfirmationMethod(), params.getReturnUrl());

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
                        .build();
            } else if ("requires_action".equals(paymentIntent.getStatus())) {
                // This state means the payment requires an additional step from the customer,
                // like 3D Secure. For a server-only flow with a test card that doesn't require 3DS,
                // you ideally want to reach 'succeeded' directly.
                // If you get here with "pm_card_visa", it's unexpected unless test mode settings changed.
                // A card like "pm_card_authenticationRequired" would land here.
                log.warn("Stripe Payment requires further action for booking id: {}. PaymentIntent ID: {}. Client Secret: {}",
                         request.getBookingId(), paymentIntent.getId(), paymentIntent.getClientSecret());
                // For a true server-side demo where you don't want to handle client-side actions,
                // this is effectively a pending/failed state for this demo's purpose.
                return PaymentResponseDto.builder()
                        .bookingId(request.getBookingId())
                        .status(PaymentResponseDto.PaymentStatus.PENDING) // Or FAILED
                        .transactionId(paymentIntent.getId())
                        .message("Payment requires further action (e.g., 3D Secure). This demo does not handle client-side actions. Client Secret: " + paymentIntent.getClientSecret())
                        .build();
            } else { // Other statuses like "requires_payment_method", "canceled", "processing"
                log.warn("Stripe Payment status is '{}' for booking id: {}. PaymentIntent ID: {}",
                         paymentIntent.getStatus(), request.getBookingId(), paymentIntent.getId());
                return PaymentResponseDto.builder()
                        .bookingId(request.getBookingId())
                        .status(PaymentResponseDto.PaymentStatus.FAILED)
                        .transactionId(paymentIntent.getId())
                        .message("Payment status on Stripe: " + paymentIntent.getStatus())
                        .build();
            }

        } catch (StripeException e) {
            log.error("Stripe API error for booking id: {}: {}", request.getBookingId(), e.getMessage(), e);
            return PaymentResponseDto.builder()
                    .bookingId(request.getBookingId())
                    .status(PaymentResponseDto.PaymentStatus.FAILED)
                    .message("Stripe API error: " + e.getMessage())
                    .build();
        } catch (Exception e) {
            log.error("Unexpected error during payment processing for booking id: {}", request.getBookingId(), e);
            return PaymentResponseDto.builder()
                    .bookingId(request.getBookingId())
                    .status(PaymentResponseDto.PaymentStatus.FAILED)
                    .message("Unexpected error during payment processing.")
                    .build();
        }
    }
}