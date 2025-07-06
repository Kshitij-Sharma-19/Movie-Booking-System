package com.movie.booking.config;

import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

import com.movie.booking.service.BookingService;

import lombok.extern.slf4j.Slf4j;

@EnableScheduling
@Slf4j
public class SchedulingConfig { // Or add to existing config

    private final BookingService bookingService;

    public SchedulingConfig(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @Scheduled(fixedRate = 60000) // Run every 60 seconds (adjust as needed)
    public void scheduleExpiredSeatLockCleanup() {
        log.info("Scheduler running: Cleaning up expired seat locks.");
        bookingService.cleanupExpiredSeatLocks();
    }
}