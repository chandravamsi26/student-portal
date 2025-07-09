package com.studentportal.controller;

import com.studentportal.dto.AuthRequest;
import com.studentportal.dto.AuthResponse;

import com.studentportal.repository.UserRepository;
import com.studentportal.service.AuthService;
import com.studentportal.service.JwtService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;


@RestController
@RequestMapping("/auth")
@CrossOrigin
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;
    private final UserRepository userRepository;

    @PostMapping("/request-otp")
    public String requestOtp(@RequestBody AuthRequest request) {
        return authService.requestOtp(request);
    }

    @PostMapping("/verify-otp")
    public AuthResponse verifyOtp(@RequestBody AuthRequest request) {
        String token = authService.verifyOtp(request);
        return new AuthResponse(token);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        try {
            String identifier = request.getEmail() != null ? request.getEmail() : request.getMobile();
            String token = authService.login(identifier, request.getPassword());
            return ResponseEntity.ok(new AuthResponse(token));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpServletResponse.SC_UNAUTHORIZED).body(
                    Map.of("message", e.getMessage())
            );
        }
    }

}
