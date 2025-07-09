package com.studentportal.controller;

import com.studentportal.dto.PaymentSuccessRequest;
import com.studentportal.service.EnrollmentService;
import com.studentportal.service.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/enroll")
@RequiredArgsConstructor
@CrossOrigin
public class EnrollmentController {
    private final EnrollmentService enrollmentService;
    private final JwtService jwtService;

    @PostMapping("/mock")
    public ResponseEntity<String> simulateEnroll(@RequestHeader("Authorization") String token,
                                                 @RequestBody PaymentSuccessRequest request) {
        String userId = jwtService.extractUsername(token.substring(7));
        return ResponseEntity.ok(enrollmentService.confirmEnrollment(userId, request));
    }

    @GetMapping("/my-courses")
    public ResponseEntity<?> getMyEnrolledCourses(@RequestHeader("Authorization") String token) {
        try {
            String userId = jwtService.extractUsername(token.substring(7));
            return ResponseEntity.ok(enrollmentService.getCoursesForUser(userId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}

