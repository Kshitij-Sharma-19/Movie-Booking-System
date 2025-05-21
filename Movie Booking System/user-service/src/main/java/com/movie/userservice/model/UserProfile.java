package com.movie.userservice.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;


import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "user_profiles")
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // This should match the 'sub' claim (subject) from the JWT token issued by auth-service
    @NotBlank(message = "Auth User ID cannot be blank")
    @Column(nullable = false, unique = true, updatable = false) // Unique and not updatable after creation
    private String authUserId;

    @NotBlank(message = "First name cannot be blank")
    @Column(nullable = false)
    private String firstName;

    private String lastName;

    // Email might be stored here too, or fetched from auth-service if needed
    // Ensure consistency if stored in both places
    @Email(message = "Invalid email format")
    @Column(unique = true) // Email should ideally be unique here too
    private String email;

    private String phoneNumber;

    private LocalDate dateOfBirth;

    @Lob
    private String address;

    @CreationTimestamp // Automatically set on creation
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp // Automatically set on update
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}