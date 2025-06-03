package com.movie.moviecatalogservice.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import org.springframework.context.annotation.Configuration;

@Configuration
// Define the basic API information via @OpenAPIDefinition in the main class or here
// @OpenAPIDefinition(info = @Info(title = "Movie Catalog API", version = "1.0", description = "API for managing Movies, Theaters, and Showtimes"))

// Define the security scheme used (JWT Bearer Token)
@SecurityScheme(
    name = "bearerAuth", // Can be referenced in @Operation(security = @SecurityRequirement(name = "bearerAuth"))
    type = SecuritySchemeType.HTTP,
    scheme = "bearer",
    bearerFormat = "JWT" // Optional: specify format
)
public class OpenApiConfig {
    // No beans needed usually, annotations handle the configuration
}