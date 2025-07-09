package com.studentportal.controller;

import com.studentportal.dto.SyllabusDto;
import com.studentportal.entity.Role;
import com.studentportal.service.JwtService;
import com.studentportal.service.SyllabusService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/syllabus")
@RequiredArgsConstructor
@CrossOrigin
public class SyllabusController {

    private final SyllabusService syllabusService;
    private final JwtService jwtService;

    @PostMapping
    public ResponseEntity<String> addSyllabus(@RequestBody SyllabusDto dto,
                                              @RequestHeader("Authorization") String token) {
        Role role = jwtService.extractUserRole(token.substring(7));
        if (role != Role.ADMIN) {
            return ResponseEntity.status(HttpServletResponse.SC_FORBIDDEN)
                    .body("Only admins can add syllabus");
        }

        return ResponseEntity.ok(syllabusService.addSyllabus(dto));
    }

    @GetMapping("/{className}")
    public ResponseEntity<SyllabusDto> getSyllabus(@PathVariable String className) {
        return ResponseEntity.ok(syllabusService.getSyllabusByClassName(className));
    }

    @GetMapping("/all")
    public ResponseEntity<List<SyllabusDto>> getAll() {
        return ResponseEntity.ok(syllabusService.getAllSyllabus());
    }

    @GetMapping("/student")
    public ResponseEntity<?> getSyllabusForStudent(@RequestHeader("Authorization") String token) {
        try {
            String userId = jwtService.extractUsername(token.substring(7));
            List<SyllabusDto> list = syllabusService.getSyllabusForStudent(userId);
            return ResponseEntity.ok(list);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateSyllabus(@PathVariable String id,
                                            @RequestBody SyllabusDto dto,
                                            @RequestHeader("Authorization") String token) {
        Role role = jwtService.extractUserRole(token.substring(7));
        if (role != Role.ADMIN) {
            return ResponseEntity.status(HttpServletResponse.SC_FORBIDDEN)
                    .body(Map.of("message", "Only admins can update syllabus"));
        }

        return ResponseEntity.ok(syllabusService.updateSyllabus(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSyllabus(@PathVariable String id,
                                            @RequestHeader("Authorization") String token) {
        Role role = jwtService.extractUserRole(token.substring(7));
        if (role != Role.ADMIN) {
            return ResponseEntity.status(HttpServletResponse.SC_FORBIDDEN)
                    .body(Map.of("message", "Only admins can delete syllabus"));
        }

        syllabusService.deleteSyllabus(id);
        return ResponseEntity.ok(Map.of("message", "Syllabus deleted successfully."));
    }
}
