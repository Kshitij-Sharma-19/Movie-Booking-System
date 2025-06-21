package com.movie.auth.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Exception thrown when attempting to register a user with an email
 * that already exists in the system.
 * Responds with HTTP 400 Bad Request by default.
 */
@ResponseStatus(HttpStatus.BAD_REQUEST) // Or HttpStatus.CONFLICT (409) if you prefer
public class UserAlreadyExistsException extends RuntimeException {

    public UserAlreadyExistsException(String message) {
        super(message);
    }

    public UserAlreadyExistsException(String message, Throwable cause) {
        super(message, cause);
    }
}
