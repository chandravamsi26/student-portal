package com.studentportal.service;

import com.studentportal.dto.PaymentSuccessRequest;
import com.studentportal.entity.Course;
import com.studentportal.entity.Enrollment;
import com.studentportal.entity.PaymentOrder;
import com.studentportal.repository.CourseRepository;
import com.studentportal.repository.EnrollmentRepository;
import com.studentportal.repository.PaymentOrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class EnrollmentService {

    private final EnrollmentRepository repository;

    private final CourseRepository courseRepository;

    private final PaymentOrderRepository paymentRepo;

    public String confirmEnrollment(String userId, PaymentSuccessRequest request) {
        PaymentOrder order = paymentRepo.findByOrderId(request.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!"SUCCESS".equals(order.getStatus())) {
            throw new RuntimeException("Payment not verified. Please confirm the payment first.");
        }

        if (repository.existsByUserIdAndCourseId(userId, request.getCourseId())) {
            return "You have already enrolled in this course.";
        }

        Course course = courseRepository.findById(order.getCourseId())
                .orElseThrow(() -> new RuntimeException("Course not found"));

        Enrollment enrollment = Enrollment.builder()
                .userId(userId)
                .courseId(course.getId())
                .courseTitle(course.getTitle())
                .paymentStatus("SUCCESS")
                .enrolledAt(LocalDateTime.now().toString())
                .build();

        repository.save(enrollment);
        return "Enrollment successful!";
    }

    public List<Map<String, Object>> getCoursesForUser(String userId) {
        List<Enrollment> enrollments = repository.findByUserId(userId);
        List<Map<String, Object>> result = new ArrayList<>();

        for (Enrollment enrollment : enrollments) {
            Optional<Course> courseOpt = courseRepository.findById(enrollment.getCourseId());
            if (courseOpt.isPresent()) {
                Course course = courseOpt.get();
                Map<String, Object> courseData = new HashMap<>();
                courseData.put("courseId", course.getId());
                courseData.put("title", course.getTitle());
                courseData.put("instructorName", course.getInstructorName());
                courseData.put("duration", course.getDuration());
                courseData.put("className", course.getClassName());
                courseData.put("price", course.getPrice());
                result.add(courseData);
            }
        }
        return result;
    }
}
