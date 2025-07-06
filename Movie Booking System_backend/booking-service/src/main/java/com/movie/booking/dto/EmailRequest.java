package com.movie.booking.dto;

import lombok.Data;

@Data
public class EmailRequest {
	 private String toEmail;
	    private String subject;
	    private String body;
	    private String base64Pdf;
	    private String fileName;
}