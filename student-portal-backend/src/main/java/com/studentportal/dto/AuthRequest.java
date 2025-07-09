package com.studentportal.dto;

import lombok.Data;

@Data
public class AuthRequest {
    private String email;
    private String mobile;
    private String otp;
    private String password;
}
