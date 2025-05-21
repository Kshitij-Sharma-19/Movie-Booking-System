package com.movie.auth.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.movie.auth.dto.JwtAuthenticationResponse;
import com.movie.auth.dto.LoginRequest;
import com.movie.auth.dto.SignUpRequest;
import com.movie.auth.service.AuthenticationService;

@RestController
@RequestMapping("/api/v1/auth") // Base path for authentication endpoints
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationService authenticationService;

    @PostMapping("/signup")
    public ResponseEntity<JwtAuthenticationResponse> signup(@Valid @RequestBody SignUpRequest request) {
        // Consider adding global exception handling for IllegalArgumentException
        return ResponseEntity.ok(authenticationService.signup(request));
    }

    @PostMapping("/login")
    public ResponseEntity<JwtAuthenticationResponse> login(@Valid @RequestBody LoginRequest request) {
         // Consider adding global exception handling for AuthenticationException
        return ResponseEntity.ok(authenticationService.login(request));
    }

    // Optional: Add endpoints for token refresh, password reset etc.
}