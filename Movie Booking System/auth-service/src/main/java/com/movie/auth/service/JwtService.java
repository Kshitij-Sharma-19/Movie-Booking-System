package com.movie.auth.service;

import io.jsonwebtoken.Claims; 
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.util.FileCopyUtils;

import com.movie.auth.config.JwtProperties;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.io.UncheckedIOException;
import java.nio.charset.StandardCharsets;
import java.security.*;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import javax.crypto.SecretKey;
@Service
@RequiredArgsConstructor
@Slf4j
public class JwtService {

    private final JwtProperties jwtProperties;

    private SecretKey secretKey;

    @PostConstruct
    public void init() {
        try {
            log.info("Initializing JWT Secret Key...");
            // Decode the Base64 secret from properties into bytes
            byte[] keyBytes = Decoders.BASE64.decode(jwtProperties.getSecret());
            // Create a SecretKey instance suitable for HMAC-SHA algorithms
            this.secretKey = Keys.hmacShaKeyFor(keyBytes);
            log.info("JWT Secret Key initialized successfully.");
        } catch (Exception e) {
            log.error("Failed to initialize JWT secret key", e);
            throw new RuntimeException("Failed to initialize JWT secret key", e);
        }
    }

   

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }

    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        String roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));
        extraClaims.put("roles", roles);

        return buildToken(extraClaims, userDetails, jwtProperties.getAccessToken().getExpiration());
    }

    private String buildToken(Map<String, Object> extraClaims, UserDetails userDetails, long expiration) {
        return Jwts.builder()
                .claims(extraClaims)
                .subject(userDetails.getUsername())
                .issuer(jwtProperties.getIssuer())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expiration))
                // Sign with the symmetric secret key using HS256
                .signWith(secretKey, Jwts.SIG.HS256)
                .compact();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        try {
            final String username = extractUsername(token);
            return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
        } catch (Exception e) {
             log.warn("JWT validation failed for token: {}", token, e);
            return false;
        }
    }

    private boolean isTokenExpired(String token) {
         try {
             return extractExpiration(token).before(new Date());
         } catch (Exception e) {
             log.warn("Could not check token expiration: {}", token, e);
             return true;
         }
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private Claims extractAllClaims(String token) {
        // Use the same symmetric secret key to verify the signature and parse claims
        return Jwts.parser()
                   .verifyWith(secretKey) // Use secret key for verification
                   .build()
                   .parseSignedClaims(token)
                   .getPayload();
    }

     // Remove methods related to RSA keys
    // public PublicKey getPublicKey() { ... }
    // public PrivateKey getPrivateKey() { ... }

    // Optional: Method to get the secret key (use carefully)
    public SecretKey getSecretKey() {
        return secretKey;
    }
}