package com.movie.userservice.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Past;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileDto {

    private Long id; // Include in response

    // authUserId is usually not part of request/response DTOs exposed externally
    // private String authUserId;

    @NotBlank(message = "First name cannot be blank")
    private String firstName;

    private String lastName;

    @Email(message = "Invalid email format")
    private String email;

    private String phoneNumber;

    @Past(message = "Date of birth must be in the past")
    private LocalDate dateOfBirth;

    private String address;

    // Timestamps are usually only in responses
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
