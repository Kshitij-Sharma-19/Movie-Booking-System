package com.movie.gateway.config;


import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public GroupedOpenApi userServiceApi() {
        return GroupedOpenApi.builder()
                .group("user-service")
                .pathsToMatch("/user-service/**")
                .build();
    }

    @Bean
    public GroupedOpenApi bookingServiceApi() {
        return GroupedOpenApi.builder()
                .group("booking-service")
                .pathsToMatch("/booking-service/**")
                .build();
    }

    @Bean
    public GroupedOpenApi movieCatalogServiceApi() {
        return GroupedOpenApi.builder()
                .group("movie-catalog-service")
                .pathsToMatch("/movie-catalog-service/**")
                .build();
    }

    @Bean
    public GroupedOpenApi paymentServiceApi() {
        return GroupedOpenApi.builder()
                .group("payment-service")
                .pathsToMatch("/payment-service/**")
                .build();
    }

    @Bean
    public GroupedOpenApi authServiceApi() {
        return GroupedOpenApi.builder()
                .group("auth-service")
                .pathsToMatch("/auth-service/**")
                .build();
    }
}
