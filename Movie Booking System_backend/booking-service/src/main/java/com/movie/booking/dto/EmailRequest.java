package com.movie.booking.dto;

public class EmailRequest {
    private String toEmail;
    private String subject;
    private String body;

    // Optional: PDF data as base64 string
    private String base64Pdf;
    private String fileName;

    // Getters and Setters
    public String getToEmail() {
        return toEmail;
    }

    public void setToEmail(String toEmail) {
        this.toEmail = toEmail;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }

    public String getBase64Pdf() {
        return base64Pdf;
    }

    public void setBase64Pdf(String base64Pdf) {
        this.base64Pdf = base64Pdf;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }
}