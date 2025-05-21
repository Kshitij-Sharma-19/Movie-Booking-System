package com.movie.userservice.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.movie.userservice.dto.CreateUserProfileRequestDto;
import com.movie.userservice.dto.UpdateUserProfileRequestDto;
import com.movie.userservice.dto.UserProfileDto;
import com.movie.userservice.exception.ResourceNotFoundException;
import com.movie.userservice.model.UserProfile;
import com.movie.userservice.repository.UserProfileRepository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class UserProfileService {

    private final UserProfileRepository userProfileRepository;

    // --- Mapping Logic ---
    private UserProfileDto convertToDto(UserProfile profile) {
        return UserProfileDto.builder()
                .id(profile.getId())
                .firstName(profile.getFirstName())
                .lastName(profile.getLastName())
                .email(profile.getEmail())
                .phoneNumber(profile.getPhoneNumber())
                .dateOfBirth(profile.getDateOfBirth())
                .address(profile.getAddress())
                .createdAt(profile.getCreatedAt())
                .updatedAt(profile.getUpdatedAt())
                .build();
    }
    // --- End Mapping Logic ---

    public UserProfileDto getUserProfileByAuthUserId(String authUserId) {
        log.info("Fetching user profile for authUserId: {}", authUserId);
        UserProfile profile = userProfileRepository.findByAuthUserId(authUserId)
                .orElseThrow(() -> new ResourceNotFoundException("UserProfile", "authUserId", authUserId));
        return convertToDto(profile);
    }

    // Method for creating a profile - potentially called after user registration in auth-service
    // or the first time user accesses their profile page.
    public UserProfileDto createUserProfile(CreateUserProfileRequestDto request, String authUserId) {
        log.info("Creating user profile for authUserId: {}", authUserId);
        if (userProfileRepository.existsByAuthUserId(authUserId)) {
            throw new IllegalArgumentException("User profile already exists for this user.");
        }
         // Check if email already exists (if email should be unique across profiles)
        if (userProfileRepository.existsByEmail(request.getEmail())) {
             throw new IllegalArgumentException("Email is already associated with another profile.");
        }

        UserProfile profile = UserProfile.builder()
                .authUserId(authUserId) // Set from authenticated principal
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail()) // Use provided email
                .phoneNumber(request.getPhoneNumber())
                .dateOfBirth(request.getDateOfBirth())
                .address(request.getAddress())
                // Timestamps are set automatically by JPA
                .build();

        UserProfile savedProfile = userProfileRepository.save(profile);
        log.info("User profile created successfully for authUserId: {} with profileId: {}", authUserId, savedProfile.getId());
        return convertToDto(savedProfile);
    }

    public UserProfileDto updateUserProfile(String authUserId, UpdateUserProfileRequestDto request) {
        log.info("Updating user profile for authUserId: {}", authUserId);
        UserProfile existingProfile = userProfileRepository.findByAuthUserId(authUserId)
                .orElseThrow(() -> new ResourceNotFoundException("UserProfile", "authUserId", authUserId));

        // Handle potential email change and uniqueness check
        if (request.getEmail() != null && !request.getEmail().equalsIgnoreCase(existingProfile.getEmail())) {
             if (userProfileRepository.existsByEmail(request.getEmail())) {
                 throw new IllegalArgumentException("Email is already associated with another profile.");
             }
             existingProfile.setEmail(request.getEmail());
        }

        // Update only non-null fields from the request DTO
        Optional.ofNullable(request.getFirstName()).ifPresent(existingProfile::setFirstName);
        Optional.ofNullable(request.getLastName()).ifPresent(existingProfile::setLastName);
        Optional.ofNullable(request.getPhoneNumber()).ifPresent(existingProfile::setPhoneNumber);
        Optional.ofNullable(request.getDateOfBirth()).ifPresent(existingProfile::setDateOfBirth);
        Optional.ofNullable(request.getAddress()).ifPresent(existingProfile::setAddress);
        // updatedAt timestamp will be updated automatically by JPA

        UserProfile updatedProfile = userProfileRepository.save(existingProfile);
        log.info("User profile updated successfully for authUserId: {}", authUserId);
        return convertToDto(updatedProfile);
    }

    // --- Admin Operations (Example) ---

    @Transactional(readOnly = true)
    public List<UserProfileDto> getAllUserProfiles() {
        log.info("Fetching all user profiles (Admin operation)");
        return userProfileRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

     public void deleteUserProfileByAuthUserId(String authUserId) {
        log.warn("Attempting to delete user profile for authUserId: {} (Admin operation)", authUserId);
        if (!userProfileRepository.existsByAuthUserId(authUserId)) {
            throw new ResourceNotFoundException("UserProfile", "authUserId", authUserId);
        }
        userProfileRepository.deleteByAuthUserId(authUserId); // Custom delete method
        log.info("User profile deleted successfully for authUserId: {}", authUserId);
    }

}