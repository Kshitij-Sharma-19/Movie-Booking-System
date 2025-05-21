package com.movie.booking;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;

@SpringBootApplication
@EnableDiscoveryClient // Register with Eureka
@EnableFeignClients // Enable Feign clients for inter-service communication
@OpenAPIDefinition(info = @Info(title = "Booking API", version = "1.0", description = "API for managing Movie Bookings"))
public class BookingServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(BookingServiceApplication.class, args);
	}

}
