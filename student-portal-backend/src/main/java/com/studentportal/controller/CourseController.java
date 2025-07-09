package com.studentportal.controller;

import com.studentportal.dto.CourseDto;
import com.studentportal.entity.Course;
import com.studentportal.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
@CrossOrigin
public class CourseController {

    private final CourseService courseService;

    @PostMapping
    public ResponseEntity<String> addCourse(@RequestBody CourseDto dto,
                                            @RequestHeader("Authorization") String token) {
        // Token validation can be added later for admin
        return ResponseEntity.ok(courseService.addCourse(dto));
    }

    @GetMapping("/{className}")
    public ResponseEntity<List<Course>> getCoursesByClass(@PathVariable String className,
                                                          @RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(courseService.getCoursesByClass(className));
    }

    @GetMapping("/details/{courseId}")
    public ResponseEntity<Course> getCourseDetails(@PathVariable String courseId,
                                                   @RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(courseService.getCourseById(courseId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateCourse(@PathVariable String id,
                                               @RequestBody CourseDto dto,
                                               @RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(courseService.updateCourse(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCourse(@PathVariable String id,
                                               @RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(courseService.deleteCourse(id));
    }

}
