package com.movie.booking.util;

import com.movie.booking.model.Booking;
import com.movie.booking.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserEmailResolver {

    private final BookingRepository bookingRepository;
    // If you have a UserRepository, inject it as well and fetch email by userId

    /**
     * Gets the userId from booking, then fetches email from user service/db
     */
    public String resolveUserEmailByBookingId(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new IllegalArgumentException("Booking not found: " + bookingId));
        String userId = booking.getUserId();

        // If you store email directly in the booking entity, return it:
        // return booking.getUserEmail();

        // If you have a user repository/service, look up email by userId:
        // return userRepository.findById(userId).map(User::getEmail).orElseThrow(...);

        // If userId is an email, just return:
        return userId;

        // If userId is a foreign key, look up in your user database/service and return email.
    }
}