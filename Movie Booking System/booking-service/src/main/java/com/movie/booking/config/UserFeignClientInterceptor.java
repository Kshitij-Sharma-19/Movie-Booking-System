package com.movie.booking.config;

import feign.RequestInterceptor;
import feign.RequestTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt; // Ensure this import is present
import org.springframework.stereotype.Component;

@Component
public class UserFeignClientInterceptor implements RequestInterceptor {

    private static final String AUTHORIZATION_HEADER = "Authorization";
    private static final String BEARER_TOKEN_TYPE = "Bearer";

    @Override
    public void apply(RequestTemplate template) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.getPrincipal() instanceof Jwt) {
            Jwt jwt = (Jwt) authentication.getPrincipal();
            template.header(AUTHORIZATION_HEADER, String.format("%s %s", BEARER_TOKEN_TYPE, jwt.getTokenValue()));
        }
        // You might also want to handle cases where the principal is not Jwt,
        // or if using a different token type from an OAuth2AuthenticationToken, for example,
        // or if authentication is null (e.g., for calls initiated by the system itself not tied to a user request).
    }
}
