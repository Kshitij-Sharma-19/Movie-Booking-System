package com.movie.booking.util;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserEmailResolver {


    /**
     * Tries to get user email from JWT claims.
     */
    public String resolveUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof Jwt) {
            Jwt jwt = (Jwt) authentication.getPrincipal();
            Object emailObj = jwt.getClaims().get("sub");
            if (emailObj != null) {
                return emailObj.toString();
            }
//            // fallback to sub/username if your JWT contains it, or fetch from auth service
//            Object userId = jwt.getClaims().get("sub");
//            if (userId != null) {
//                return authServiceClient.getUserEmailById(userId.toString());
//            }
        }
        // As a last fallback, you may throw or return null
        throw new IllegalStateException("Unable to resolve user email from token or auth service");
    }
}