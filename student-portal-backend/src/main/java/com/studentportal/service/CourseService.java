package com.studentportal.service;

import com.studentportal.dto.CourseDto;
import com.studentportal.entity.Course;
import com.studentportal.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;

    public String addCourse(CourseDto dto) {
        Course course = Course.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .className(dto.getClassName())
                .price(dto.getPrice())
                .duration(dto.getDuration())
                .instructorName(dto.getInstructorName())
                .courseUrl(dto.getCourseUrl())
                .thumbnailUrl(dto.getThumbnailUrl())
                .build();

        courseRepository.save(course);
        return "Course added successfully!";
    }

    public List<Course> getCoursesByClass(String className) {
        return courseRepository.findByClassName(className);
    }

    public Course getCourseById(String courseId) {
        return courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
    }

    public String updateCourse(String courseId, CourseDto dto) {
        Optional<Course> optionalCourse = courseRepository.findById(courseId);
        if (optionalCourse.isEmpty()) {
            throw new RuntimeException("Course not found");
        }

        Course course = optionalCourse.get();
        course.setTitle(dto.getTitle());
        course.setDescription(dto.getDescription());
        course.setClassName(dto.getClassName());
        course.setPrice(dto.getPrice());
        course.setDuration(dto.getDuration());
        course.setInstructorName(dto.getInstructorName());
        course.setCourseUrl(dto.getCourseUrl());
        course.setThumbnailUrl(dto.getThumbnailUrl());

        courseRepository.save(course);
        return "Course updated successfully";
    }

    public String deleteCourse(String courseId) {
        if (!courseRepository.existsById(courseId)) {
            throw new RuntimeException("Course not found");
        }
        courseRepository.deleteById(courseId);
        return "Course deleted successfully";
    }
}
