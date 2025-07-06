package com.movie.booking.util;

import com.itextpdf.io.image.ImageData;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.barcodes.BarcodeQRCode;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Image;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.properties.TextAlignment;

import java.io.ByteArrayOutputStream;
import java.net.URL;

public class PdfGenerator {

	public static byte[] generateTicketPdf(String bookingDetails) {
	    try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
	        PdfWriter writer = new PdfWriter(baos);
	        PdfDocument pdfDoc = new PdfDocument(writer);
	        Document document = new Document(pdfDoc, PageSize.A6);
	        document.setMargins(10, 10, 10, 10);  // Reduce margins

	        // Load logo
	        URL imageUrl = PdfGenerator.class.getClassLoader().getResource("images/logo.png");
	        if (imageUrl != null) {
	            ImageData logoData = ImageDataFactory.create(imageUrl);
	            Image logo = new Image(logoData)
	                    .scaleToFit(60, 60)
	                    .setHorizontalAlignment(com.itextpdf.layout.properties.HorizontalAlignment.CENTER);
	            document.add(logo);
	        }

	        // Title
	        Paragraph title = new Paragraph("🎬 Movie Ticket")
	                .setFontSize(14)
	                .setBold()
	                .setTextAlignment(TextAlignment.CENTER)
	                .setFontColor(ColorConstants.RED)
	                .setMarginBottom(8);
	        document.add(title);

	        // Format booking details
	        String[] lines = bookingDetails.split("\n");
	        for (String line : lines) {
	            Paragraph detail = new Paragraph(line.trim())
	                    .setFontSize(10)
	                    .setTextAlignment(TextAlignment.LEFT)
	                    .setMarginBottom(2);
	            document.add(detail);
	        }

	        // QR Code
	        BarcodeQRCode qrCode = new BarcodeQRCode(bookingDetails);
	        Image qrImage = new Image(qrCode.createFormXObject(pdfDoc))
	                .scaleToFit(70, 70)
	                .setHorizontalAlignment(com.itextpdf.layout.properties.HorizontalAlignment.CENTER)
	                .setMarginTop(10);
	        document.add(qrImage);

	        document.close();
	        return baos.toByteArray();
	    } catch (Exception e) {
	        throw new RuntimeException("Error generating PDF ticket", e);
	    }
	}
}
