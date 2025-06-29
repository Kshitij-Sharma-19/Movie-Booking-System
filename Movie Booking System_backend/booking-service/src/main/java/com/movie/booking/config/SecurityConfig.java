package com.movie.booking.config;

import javax.crypto.SecretKey; 
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.web.SecurityFilterChain;

import io.jsonwebtoken.io.Decoders;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true) // Enable method-level security if needed
public class SecurityConfig {

    @Value("${jwt.secret}")
    private String jwtSecret;
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(authz -> authz
                // Allow public access to Swagger UI and API docs, actuator health
                .requestMatchers("/swagger-ui/**",
                                 "/v3/api-docs/**",
                                 "/swagger-resources/**",
                                 "/webjars/**",
                                 "/api-docs/**",
                                 "/actuator/health").permitAll()
                .requestMatchers("/api/v1/bookings/*/confirm").permitAll()
                .requestMatchers("/api/email/send").permitAll()
                 // All other requests under /api/v1/bookings require authentication
                .requestMatchers("/api/v1/bookings/**").authenticated()
                // Secure any other potential endpoints
                .anyRequest().authenticated() // Default deny? Or permitAll() if no other endpoints
            )
            .oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults())); // Validate JWTs

        return http.build();
    }

    @Bean
    public JwtDecoder jwtDecoder() {
        // Decode the Base64 secret string into bytes
        byte[] keyBytes = Decoders.BASE64.decode(this.jwtSecret);
        // Create a SecretKey suitable for the HMAC algorithm used (HS256)
        SecretKey key = new SecretKeySpec(keyBytes, 0, keyBytes.length, "HmacSHA256");

        // Configure the JwtDecoder to use the symmetric secret key
        return NimbusJwtDecoder.withSecretKey(key).build();
    }
}