package com.movie.userservice.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import com.movie.userservice.dto.CreateUserProfileRequestDto;
import com.movie.userservice.dto.UpdateUserProfileRequestDto;
import com.movie.userservice.dto.UserProfileDto;
import com.movie.userservice.service.UserProfileService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "User Profile Management", description = "APIs for managing user profiles")
public class UserProfileController {

    private final UserProfileService userProfileService;

    @GetMapping("/me")
    @Operation(summary = "Get my profile", description = "Retrieves the profile details for the authenticated user.",
               security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponse(responseCode = "200", description = "Successfully retrieved profile")
    @ApiResponse(responseCode = "404", description = "Profile not found (user might need to create one)")
    @ApiResponse(responseCode = "401", description = "Unauthorized")
    public ResponseEntity<UserProfileDto> getMyProfile(
            @Parameter(hidden = true) @AuthenticationPrincipal Jwt jwt) {
        String authUserId = jwt.getSubject();
        log.info("Request received for getMyProfile by user: {}", authUserId);
        return ResponseEntity.ok(userProfileService.getUserProfileByAuthUserId(authUserId));
    }

    @PostMapping("/me")
    @Operation(summary = "Create my profile", description = "Creates a profile for the authenticated user. Should only be called if profile doesn't exist.",
               security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponse(responseCode = "201", description = "Profile created successfully")
    @ApiResponse(responseCode = "400", description = "Invalid input or profile/email already exists")
    @ApiResponse(responseCode = "401", description = "Unauthorized")
    public ResponseEntity<UserProfileDto> createMyProfile(
            @Valid @RequestBody CreateUserProfileRequestDto request,
            @Parameter(hidden = true) @AuthenticationPrincipal Jwt jwt) {
        String authUserId = jwt.getSubject();
        log.info("Request received for createMyProfile by user: {}", authUserId);
        // Optionally, pre-fill email from JWT if available and desired
        // String emailFromJwt = jwt.getClaimAsString("email");
        // if (emailFromJwt != null && !emailFromJwt.equalsIgnoreCase(request.getEmail())) {
        //     throw new IllegalArgumentException("Email in request does not match token.");
        // }
        UserProfileDto createdProfile = userProfileService.createUserProfile(request, authUserId);
        return new ResponseEntity<>(createdProfile, HttpStatus.CREATED);
    }

    @PutMapping("/me")
    @Operation(summary = "Update my profile", description = "Updates the profile details for the authenticated user.",
               security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponse(responseCode = "200", description = "Profile updated successfully")
    @ApiResponse(responseCode = "400", description = "Invalid input or email conflict")
    @ApiResponse(responseCode = "404", description = "Profile not found")
    @ApiResponse(responseCode = "401", description = "Unauthorized")
    public ResponseEntity<UserProfileDto> updateMyProfile(
            @Valid @RequestBody UpdateUserProfileRequestDto request, // Use a separate DTO for updates
            @Parameter(hidden = true) @AuthenticationPrincipal Jwt jwt) {
        String authUserId = jwt.getSubject();
        log.info("Request received for updateMyProfile by user: {}", authUserId);
        return ResponseEntity.ok(userProfileService.updateUserProfile(authUserId, request));
    }

    // --- Admin Endpoints ---

    @GetMapping // Requires ADMIN role
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "[Admin] Get all user profiles", description = "Retrieves a list of all user profiles. Requires ADMIN role.",
               security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponse(responseCode = "200", description = "Successfully retrieved list")
    @ApiResponse(responseCode = "401", description = "Unauthorized")
    @ApiResponse(responseCode = "403", description = "Forbidden")
    public ResponseEntity<List<UserProfileDto>> getAllUserProfiles() {
        log.info("Request received for getAllUserProfiles (Admin)");
        return ResponseEntity.ok(userProfileService.getAllUserProfiles());
    }

    @GetMapping("/{authUserId}") // Requires ADMIN role
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "[Admin] Get user profile by Auth User ID", description = "Retrieves a specific user profile by their authentication user ID. Requires ADMIN role.",
               security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponse(responseCode = "200", description = "Successfully retrieved profile")
    @ApiResponse(responseCode = "404", description = "Profile not found")
    @ApiResponse(responseCode = "401", description = "Unauthorized")
    @ApiResponse(responseCode = "403", description = "Forbidden")
    public ResponseEntity<UserProfileDto> getUserProfileByAuthUserId(
             @Parameter(description = "Authentication User ID (from JWT subject)") @PathVariable String authUserId) {
         log.info("Request received for getUserProfileByAuthUserId: {} (Admin)", authUserId);
        return ResponseEntity.ok(userProfileService.getUserProfileByAuthUserId(authUserId));
    }


    @DeleteMapping("/{authUserId}") // Requires ADMIN role
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "[Admin] Delete user profile by Auth User ID", description = "Deletes a specific user profile by their authentication user ID. Requires ADMIN role.",
               security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponse(responseCode = "204", description = "Profile deleted successfully")
    @ApiResponse(responseCode = "404", description = "Profile not found")
    @ApiResponse(responseCode = "401", description = "Unauthorized")
    @ApiResponse(responseCode = "403", description = "Forbidden")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteUserProfileByAuthUserId(
             @Parameter(description = "Authentication User ID (from JWT subject)") @PathVariable String authUserId) {
        log.warn("Request received for deleteUserProfileByAuthUserId: {} (Admin)", authUserId); // Log deletion attempts
        userProfileService.deleteUserProfileByAuthUserId(authUserId);
    }
}