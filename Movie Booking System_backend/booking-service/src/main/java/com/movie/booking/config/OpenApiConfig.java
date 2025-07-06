package com.movie.booking.config;

import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.security.SecurityScheme;

@Configuration
//Define the security scheme used (JWT Bearer Token) - same as movie-catalog
@SecurityScheme(
 name = "bearerAuth",
 type = SecuritySchemeType.HTTP,
 scheme = "bearer",
 bearerFormat = "JWT"
)
public class OpenApiConfig {
}