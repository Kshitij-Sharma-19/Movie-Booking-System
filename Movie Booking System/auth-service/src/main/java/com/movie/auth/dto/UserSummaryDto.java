package com.movie.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime; // Assuming User entity has createdAt/updatedAt

import com.movie.auth.model.Role;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserSummaryDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private Role role;

}

