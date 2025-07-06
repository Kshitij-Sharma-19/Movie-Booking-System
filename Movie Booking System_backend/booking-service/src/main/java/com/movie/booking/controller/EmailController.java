package com.movie.booking.controller;

import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.movie.booking.dto.EmailRequest;
import com.movie.booking.service.EmailService;

import java.util.Base64;

@RestController
@RequestMapping("/api/email")
public class EmailController {

    @Autowired
    private EmailService emailService;

    @PostMapping("/send")
    public String sendEmail(@RequestBody EmailRequest request) {
        try {
            byte[] pdfBytes = null;

            if (request.getBase64Pdf() != null && !request.getBase64Pdf().isEmpty()) {
                pdfBytes = Base64.getDecoder().decode(request.getBase64Pdf());
            }

            //Same service method acting for sending email for tickets and contact us query
            emailService.sendBookingConfirmation(
                request.getToEmail(),
                request.getSubject(),
                request.getBody(),
                pdfBytes != null ? pdfBytes : new byte[0],
                request.getFileName() != null ? request.getFileName() : "attachment.pdf"
            );

            return "Email sent successfully.";
        } catch (MessagingException e) {
            e.printStackTrace();
            return "Failed to send email: " + e.getMessage();
        }
    }
}