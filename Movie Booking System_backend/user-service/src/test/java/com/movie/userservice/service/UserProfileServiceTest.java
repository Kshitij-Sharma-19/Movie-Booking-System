package com.movie.userservice.service;

import com.movie.userservice.dto.CreateUserProfileRequestDto;
import com.movie.userservice.dto.UpdateUserProfileRequestDto;
import com.movie.userservice.dto.UserProfileDto;
import com.movie.userservice.exception.ResourceNotFoundException;
import com.movie.userservice.model.UserProfile;
import com.movie.userservice.repository.UserProfileRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserProfileServiceTest {

    @Mock
    private UserProfileRepository userProfileRepository;

    @InjectMocks
    private UserProfileService userProfileService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetUserProfileByAuthUserId_Success() {
        // Arrange
        String authUserId = "testAuthUserId";
        UserProfile userProfile = new UserProfile();
        
        userProfile.setAuthUserId(authUserId);
        userProfile.setId(123L);
        when(userProfileRepository.findByAuthUserId(authUserId)).thenReturn(Optional.of(userProfile));

        // Act
        UserProfileDto result = userProfileService.getUserProfileByAuthUserId(authUserId);

        // Assert
        assertNotNull(result);
        assertEquals(123L, result.getId());
        verify(userProfileRepository, times(1)).findByAuthUserId(authUserId);
    }

    @Test
    void testGetUserProfileByAuthUserId_NotFound() {
        // Arrange
        String authUserId = "nonExistentAuthUserId";
        when(userProfileRepository.findByAuthUserId(authUserId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> userProfileService.getUserProfileByAuthUserId(authUserId));
        verify(userProfileRepository, times(1)).findByAuthUserId(authUserId);
    }

    @Test
    void testCreateUserProfile_Success() {
        // Arrange
        String authUserId = "newAuthUserId";
        CreateUserProfileRequestDto request = new CreateUserProfileRequestDto();
        request.setEmail("test@example.com");
        UserProfile userProfile = new UserProfile();
        userProfile.setId(123L);
        userProfile.setAuthUserId(authUserId);
        when(userProfileRepository.existsByAuthUserId(authUserId)).thenReturn(false);
        when(userProfileRepository.existsByEmail(request.getEmail())).thenReturn(false);
        when(userProfileRepository.save(any(UserProfile.class))).thenReturn(userProfile);

        // Act
        UserProfileDto result = userProfileService.createUserProfile(request, authUserId);

        // Assert
        assertNotNull(result);
        assertEquals(123L, result.getId());
        verify(userProfileRepository, times(1)).existsByAuthUserId(authUserId);
        verify(userProfileRepository, times(1)).existsByEmail(request.getEmail());
        verify(userProfileRepository, times(1)).save(any(UserProfile.class));
    }

    @Test
    void testCreateUserProfile_ExistingAuthUserId() {
        // Arrange
        String authUserId = "existingAuthUserId";
        CreateUserProfileRequestDto request = new CreateUserProfileRequestDto();
        when(userProfileRepository.existsByAuthUserId(authUserId)).thenReturn(true);

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> userProfileService.createUserProfile(request, authUserId));
        verify(userProfileRepository, times(1)).existsByAuthUserId(authUserId);
    }

    @Test
    void testUpdateUserProfile_Success() {
        // Arrange
        String authUserId = "updateAuthUserId";
        UpdateUserProfileRequestDto request = new UpdateUserProfileRequestDto();
        request.setEmail("newEmail@example.com");
        UserProfile userProfile = new UserProfile();
        userProfile.setAuthUserId(authUserId);
        userProfile.setId(123L);
        when(userProfileRepository.findByAuthUserId(authUserId)).thenReturn(Optional.of(userProfile));
        when(userProfileRepository.existsByEmail(request.getEmail())).thenReturn(false);

        when(userProfileRepository.save(any(UserProfile.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        UserProfileDto result = userProfileService.updateUserProfile(authUserId, request);

        // Assert
        assertNotNull(result);
        assertEquals(123L, result.getId());
        verify(userProfileRepository, times(1)).findByAuthUserId(authUserId);
        verify(userProfileRepository, times(1)).existsByEmail(request.getEmail());
    }
}