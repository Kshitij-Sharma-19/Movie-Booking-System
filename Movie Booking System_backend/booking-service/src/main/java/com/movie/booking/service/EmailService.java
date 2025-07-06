package com.movie.booking.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}") // 👈 Fetch the "from" address from application.properties
    private String fromEmail;

    public void sendBookingConfirmation(String toEmail, String subject, String body, byte[] pdfData, String fileName) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setFrom(fromEmail); // 👈 Setting sender address
        helper.setTo(toEmail);
        helper.setSubject(subject);
        helper.setText(body, true); // true = HTML enabled

        if (pdfData != null && pdfData.length > 0) {
            helper.addAttachment(fileName, new ByteArrayResource(pdfData));
        }

        mailSender.send(message);
    }
}
