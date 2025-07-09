package com.studentportal.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentWithCoursesDto {
    private String id;
    private String fullName;
    private String className;
    private String schoolName;
    private String rollNumber;
    private String fatherName;
    private String motherName;
    private List<EnrollmentWithTitleDto> enrollments;
}
