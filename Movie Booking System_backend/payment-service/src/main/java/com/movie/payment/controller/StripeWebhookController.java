package com.movie.payment.controller;

import com.stripe.model.Event; 
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.util.Date;
import java.util.List;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;

@RestController
@RequestMapping("/api/v1/payments/webhook")
@Slf4j
public class StripeWebhookController {

    @Value("${stripe.webhook.secret}")
    private String endpointSecret;
  
    
    @Autowired
    private RestTemplate restTemplate;
  
    @PostMapping
    public ResponseEntity<String> handleStripeEvent(@RequestBody String payload, @RequestHeader("Stripe-Signature") String sigHeader) throws IOException {
        Event event = null;
        try {
            event = Webhook.constructEvent(payload, sigHeader, endpointSecret);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Webhook error: " + e.getMessage());
        }

        if ("checkout.session.completed".equals(event.getType())) {
            Session session = (Session) event.getDataObjectDeserializer().getObject().get();
            String bookingId = session.getMetadata().get("booking_id");

            
            // TODO: Call booking-service to mark booking as CONFIRMED
            // e.g. restTemplate.postForEntity("http://booking-service/api/v1/bookings/{id}/confirm", null, Void.class, bookingId);
            String bookingServiceUrl = "http://localhost:8083/api/v1/bookings/" + bookingId + "/confirm";
            log.info("Calling booking-service confirm endpoint for bookingId {}", bookingId);

//        	HttpHeaders headers = new HttpHeaders();
//            String token = jwtTokenProvider.generateServiceJwt();
////            System.out.println(token);
//        	headers.setBearerAuth(token);
//        	HttpEntity<?> entity = new HttpEntity<>(headers);
            try {
 
            	restTemplate.exchange(bookingServiceUrl, HttpMethod.POST, null, Void.class);
            
                log.info("Successfully called booking-service for bookingId {}", bookingId);

            } catch (Exception e) {
                log.error("Failed to confirm booking {} via booking-service: {}", bookingId, e.getMessage(), e);
            }
        }
        
        return ResponseEntity.ok("Received");
    }
}