package com.studentportal.service;

import com.studentportal.dto.AuthRequest;
import com.studentportal.entity.Role;
import com.studentportal.entity.User;
import com.studentportal.repository.UserRepository;
import com.studentportal.util.OtpStore;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Random;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private OtpSenderService otpSenderService;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public String requestOtp(AuthRequest request) {
        String contact = request.getEmail() != null ? request.getEmail() : request.getMobile();
        if (contact == null) {
            throw new RuntimeException("Either email or mobile is required");
        }

        // Check if user already exists
        Optional<User> existingUser = request.getEmail() != null
                ? userRepository.findByEmail(request.getEmail())
                : userRepository.findByMobile(request.getMobile());

        if (existingUser.isPresent()) {
            throw new RuntimeException("User already exists. Please login instead.");
        }

        validatePassword(request.getPassword());

        String otp = String.valueOf(new Random().nextInt(899999) + 100000);
        OtpStore.storeOtp(contact, otp);

        // Send OTP to email or mobile
        if (request.getEmail() != null) {
            otpSenderService.sendEmailOtp(request.getEmail(), otp);
            return "OTP sent to your email";
        } else {
            // we will implement real SMS sending in the next step
//            otpSenderService.sendSmsOtp(request.getMobile(), otp);
            System.out.println("OTP for mobile " + request.getMobile() + ": " + otp);
            return "OTP sent to your mobile number";
        }
    }

    public String verifyOtp(AuthRequest request) {
        String contact = request.getEmail() != null ? request.getEmail() : request.getMobile();
        String storedOtp = OtpStore.getOtp(contact);

        if (storedOtp == null || !storedOtp.equals(request.getOtp())) {
            throw new RuntimeException("Invalid OTP");
        }

        validatePassword(request.getPassword());

        User user = User.builder()
                .email(request.getEmail())
                .mobile(request.getMobile())
                .password(passwordEncoder.encode(request.getPassword()))
                .isVerified(true)
                .role(Role.USER)
                .build();

        userRepository.save(user);
        OtpStore.removeOtp(contact);

        return jwtService.generateToken(contact, user.getRole());
    }

    public String login(String identifier, String password) {
        Optional<User> optionalUser = userRepository.findByEmail(identifier);
        if (optionalUser.isEmpty()) {
            optionalUser = userRepository.findByMobile(identifier);
        }

        if (optionalUser.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        User user = optionalUser.get();
        if (!user.isVerified() || user.getPassword() == null || !passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        String id = user.getEmail() != null ? user.getEmail() : user.getMobile();
        return jwtService.generateToken(id, user.getRole());
    }

    private void validatePassword(String password) {
        if (password == null || password.length() < 8 ||
                !password.matches(".*[A-Z].*") ||
                !password.matches(".*[a-z].*") ||
                !password.matches(".*\\d.*") ||
                !password.matches(".*[!@#$%^&*()].*")) {

            throw new RuntimeException("Password must be at least 8 characters long and include uppercase, lowercase, number, and special character");
        }
    }
}
