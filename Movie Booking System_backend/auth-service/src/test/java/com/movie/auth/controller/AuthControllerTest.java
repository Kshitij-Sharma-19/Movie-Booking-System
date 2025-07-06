package com.movie.auth.controller;

import com.movie.auth.dto.JwtAuthenticationResponse;
import com.movie.auth.dto.LoginRequest;
import com.movie.auth.dto.SignUpRequest;
import com.movie.auth.dto.UserInfoResponse;
import com.movie.auth.service.AuthenticationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

import java.util.ArrayList;


class AuthControllerTest {

    @Mock
    private AuthenticationService authenticationService;

    @InjectMocks
    private AuthController authController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testSignup() {
        // Arrange
        SignUpRequest signUpRequest = new SignUpRequest();
        signUpRequest.setEmail("test@example.com");
        JwtAuthenticationResponse expectedResponse = new JwtAuthenticationResponse("token",
        		new UserInfoResponse(1L,signUpRequest.getEmail(), "Test","Test" , Arrays.asList("Role_Test")));
        when(authenticationService.signup(signUpRequest)).thenReturn(expectedResponse);

        // Act
        ResponseEntity<JwtAuthenticationResponse> response = authController.signup(signUpRequest);

        // Assert
        assertEquals(ResponseEntity.ok(expectedResponse), response);
        verify(authenticationService, times(1)).signup(signUpRequest);
    }

    @Test
    void testLogin() {
        // Arrange
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("test@example.com");
        JwtAuthenticationResponse expectedResponse = new JwtAuthenticationResponse("token",
        		new UserInfoResponse(1L,loginRequest.getEmail(), "Test","Test" , Arrays.asList("Role_Test")));
        when(authenticationService.login(loginRequest)).thenReturn(expectedResponse);

        // Act
        ResponseEntity<JwtAuthenticationResponse> response = authController.login(loginRequest);

        // Assert
        assertEquals(ResponseEntity.ok(expectedResponse), response);
        verify(authenticationService, times(1)).login(loginRequest);
    }
}