package com.movie.auth.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;

@Configuration
@ConfigurationProperties(prefix = "jwt") // Bind properties starting with 'jwt'
@Getter
@Setter
public class JwtProperties {

    // Inject values using @Value or let ConfigurationProperties handle it
	private String secret;

    private String issuer;

    private AccessToken accessToken;
    // Optional: Add refresh token properties if needed
    // private RefreshToken refreshToken;

    @Getter
    @Setter
    public static class AccessToken {
        private long expiration;
    }

    // Optional: Add RefreshToken class if needed
    // @Getter
    // @Setter
    // public static class RefreshToken {
    //     private long expiration;
    // }
}