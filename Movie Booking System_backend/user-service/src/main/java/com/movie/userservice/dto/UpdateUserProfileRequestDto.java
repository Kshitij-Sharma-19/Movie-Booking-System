package com.movie.userservice.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Past;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

// DTO specifically for updating a profile (fields are optional)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserProfileRequestDto {

    // Fields that can be updated
    private String firstName; // Making optional on update, but service might enforce rules
    private String lastName;

    @Email(message = "Invalid email format")
    private String email; // Allow email update? Needs careful consideration for uniqueness.

    private String phoneNumber;

    @Past(message = "Date of birth must be in the past")
    private LocalDate dateOfBirth;

    private String address;
}