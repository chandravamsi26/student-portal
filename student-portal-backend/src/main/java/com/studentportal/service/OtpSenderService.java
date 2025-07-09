package com.studentportal.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.http.*;
import org.springframework.web.client.RestTemplate;

@Service
public class OtpSenderService {

    @Autowired
    private JavaMailSender mailSender;

    private final RestTemplate restTemplate = new RestTemplate();

    private final String API_KEY = "940afb33-5665-11f0-a562-0200cd936042";

    public void sendSmsOtp(String mobile, String otp) {
        String url = "https://2factor.in/API/V1/" + API_KEY + "/SMS/" + mobile + "/" + otp + "/AUTOGEN";

        try {
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            System.out.println("SMS Response: " + response.getBody());
            System.out.println("HTTP Status: " + response.getStatusCode());

            if (!response.getStatusCode().is2xxSuccessful()) {
                throw new RuntimeException("Failed to send SMS OTP: " + response.getBody());
            }
        } catch (Exception e) {
            throw new RuntimeException("Error while sending SMS OTP", e);
        }
    }


    public void sendEmailOtp(String to, String otp) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(to);
            helper.setSubject("Your OTP for Student Portal Signup");

            String htmlContent = "<div style='font-family: Arial, sans-serif; padding: 20px; background: #f9f9f9;'>" +
                    "<div style='max-width: 600px; margin: auto; background: white; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.05);'>" +
                    "<div style='padding: 30px; text-align: center;'>" +
                    "<h2 style='color: #4A90E2;'>Student Portal</h2>" +
                    "<p style='font-size: 16px;'>Hi there,</p>" +
                    "<p style='font-size: 16px;'>Use the following OTP to log in to your account:</p>" +
                    "<div style='margin: 30px 0;'>" +
                    "<span style='display: inline-block; font-size: 28px; font-weight: bold; letter-spacing: 6px; color: #333; padding: 10px 20px; border: 2px dashed #4A90E2; border-radius: 6px; background: #f1f8ff;'>" + otp + "</span>" +
                    "</div>" +
                    "<p style='font-size: 14px; color: #777;'>This OTP is valid for 10 minutes. Do not share it with anyone.</p>" +
                    "<p style='font-size: 14px; color: #aaa; margin-top: 30px;'>If you didn't request this, please ignore this email.</p>" +
                    "<hr style='margin: 40px 0;'>" +
                    "<p style='font-size: 12px; color: #bbb;'>© 2025 Student Portal. All rights reserved.</p>" +
                    "</div>" +
                    "</div>" +
                    "</div>";

            helper.setText(htmlContent, true);
            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send OTP email", e);
        }
    }
}
