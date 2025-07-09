package com.studentportal.dto;

import lombok.Data;

@Data
public class AuthRequest {
    private String email;    // optional
    private String mobile;   // optional
    private String otp;
    private String password;
}
