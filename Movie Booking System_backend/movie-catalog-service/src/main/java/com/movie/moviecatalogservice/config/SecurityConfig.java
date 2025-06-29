package com.movie.moviecatalogservice.config;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter; // Import if not already there
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AbstractAuthenticationToken; // Import if not already there
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.jwt.Jwt; // Import if not already there
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter; // Import
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter; // Import
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.security.core.GrantedAuthority; // Import if not already there
import org.springframework.security.core.authority.SimpleGrantedAuthority; // Import if not already there


import io.jsonwebtoken.io.Decoders;

import java.util.Collection; // Import if not already there
import java.util.Collections; // Import if not already there
import java.util.List; // Import if not already there
import java.util.stream.Collectors; // Import if not already there
import java.util.stream.Stream; // Import if not already there

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true) // Enable @PreAuthorize annotations
public class SecurityConfig {

//    private final WebMvcConfigurer corsConfigurer;

	@Value("${jwt.secret}")
	private String jwtSecret;

//    SecurityConfig(WebMvcConfigurer corsConfigurer) {
//        this.corsConfigurer = corsConfigurer;
//    }
	   
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) 
            .authorizeHttpRequests(authz -> authz
                .requestMatchers(HttpMethod.GET,
                                 "/api/v1/movies/**",
                                 "/api/v1/theaters/**",
                                 "/api/v1/showtimes/search", 
                                 "/api/v1/showtimes/movie/**", 
                                 "/api/v1/showtimes/{id}" 
                                 ).permitAll()
                .requestMatchers("/swagger-ui/**",
                                 "/v3/api-docs/**",
                                 "/swagger-resources/**",
                                 "/webjars/**",
                                 "/api-docs/**",
                                 "/actuator/health").permitAll()
                .anyRequest().authenticated()
            )
            // Configure the custom JwtAuthenticationConverter
            .oauth2ResourceServer(oauth2 -> oauth2.jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter()))); 

        return http.build();
    }

    @Bean
    public JwtDecoder jwtDecoder() {
        byte[] keyBytes = Decoders.BASE64.decode(this.jwtSecret);
        SecretKey key = new SecretKeySpec(keyBytes, 0, keyBytes.length, "HmacSHA256");
        return NimbusJwtDecoder.withSecretKey(key).build();
    }

    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter grantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
        // Tell Spring to use the "roles" claim for authorities
        grantedAuthoritiesConverter.setAuthoritiesClaimName("roles");
        // Set the authority prefix to empty since your claim already contains "ROLE_"
        grantedAuthoritiesConverter.setAuthorityPrefix(""); 

        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(grantedAuthoritiesConverter);
        return jwtAuthenticationConverter;
    }
}