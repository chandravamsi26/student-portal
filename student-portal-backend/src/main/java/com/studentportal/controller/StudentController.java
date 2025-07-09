package com.studentportal.controller;

import com.studentportal.dto.StudentDto;
import com.studentportal.dto.StudentWithCoursesDto;
import com.studentportal.entity.Role;
import com.studentportal.entity.Student;
import com.studentportal.service.JwtService;
import com.studentportal.service.StudentService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/student")
@RequiredArgsConstructor
@CrossOrigin
public class StudentController {

    private final StudentService studentService;
    private final JwtService jwtService;

    @PostMapping("/submit")
    public ResponseEntity<Map<String, String>> submitStudentForm(
            @RequestHeader("Authorization") String token,
            @RequestBody StudentDto dto) {
        try {
            log.info("Student form endpoint called");
            String userId = jwtService.extractUsername(token.substring(7));
            String message = studentService.saveStudent(userId, dto);
            Map<String, String> response = new HashMap<>();
            response.put("message", message);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Failed to save student: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }



    // ✅ Fetching Student Details
    @GetMapping("/details")
    public ResponseEntity<Map<String, Object>> getStudent(@RequestHeader("Authorization") String token) {
        try {
            String userId = jwtService.extractUsername(token.substring(7));
            return studentService.getStudentByUserIdOptional(userId)
                    .<ResponseEntity<Map<String, Object>>>map(student -> {
                        Map<String, Object> response = new HashMap<>();
                        response.put("student", student);
                        return ResponseEntity.ok(response);
                    })
                    .orElseGet(() -> {
                        Map<String, Object> response = new HashMap<>();
                        response.put("student", null);  // 👈 return null in JSON safely
                        return ResponseEntity.ok(response);
                    });
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("student", null);
            return ResponseEntity.ok(error);
        }
    }

    @GetMapping("/admin/students")
    public ResponseEntity<?> getAllStudentsWithCourses(@RequestHeader("Authorization") String token) {
        try {
            Role role = jwtService.extractUserRole(token.substring(7));
            if (role != Role.ADMIN) {
                return ResponseEntity.status(HttpServletResponse.SC_FORBIDDEN)
                        .body(Map.of("message", "Only admins can access this endpoint"));
            }

            List<StudentWithCoursesDto> result = studentService.getAllStudentsWithCourses();
            return ResponseEntity.ok(result);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateStudent(@RequestHeader("Authorization") String token,
                                           @PathVariable String id,
                                           @RequestBody StudentDto dto) {
        try {
            Role role = jwtService.extractUserRole(token.substring(7));
            if (role != Role.ADMIN) {
                return ResponseEntity.status(HttpServletResponse.SC_FORBIDDEN)
                        .body(Map.of("message", "Only admins can update student info"));
            }

            String result = studentService.updateStudentById(id, dto);
            return ResponseEntity.ok(Map.of("message", result));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Update failed: " + e.getMessage()));
        }
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteStudent(@RequestHeader("Authorization") String token, @PathVariable String id) {
        try {
            Role role = jwtService.extractUserRole(token.substring(7));
            if (role != Role.ADMIN) {
                return ResponseEntity.status(HttpServletResponse.SC_FORBIDDEN)
                        .body(Map.of("message", "Only admins can delete students"));
            }

            String result = studentService.deleteStudentById(id);
            return ResponseEntity.ok(Map.of("message", result));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Error deleting student: " + e.getMessage()));
        }
    }

}
