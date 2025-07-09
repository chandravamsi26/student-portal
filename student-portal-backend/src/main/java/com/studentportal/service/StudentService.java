package com.studentportal.service;

import com.studentportal.dto.EnrollmentWithTitleDto;
import com.studentportal.dto.StudentDto;
import com.studentportal.dto.StudentWithCoursesDto;
import com.studentportal.entity.Course;
import com.studentportal.entity.Enrollment;
import com.studentportal.entity.Student;
import com.studentportal.repository.CourseRepository;
import com.studentportal.repository.EnrollmentRepository;
import com.studentportal.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final CourseRepository courseRepository;
    
    public String saveStudent(String userId, StudentDto dto) {
        if (studentRepository.findByUserId(userId).isPresent()) {
            return "Form already submitted!";
        }

        Student student = Student.builder()
                .userId(userId)
                .fullName(dto.getFullName())
                .rollNumber(dto.getRollNumber())
                .schoolName(dto.getSchoolName())
                .className(dto.getClassName())
                .fatherName(dto.getFatherName())
                .motherName(dto.getMotherName())
                .formSubmitted(true)
                .build();

        studentRepository.save(student);
        return "Student form submitted successfully!";
    }

    public Optional<Student> getStudentByUserIdOptional(String userId) {
        return studentRepository.findByUserId(userId);
    }

    public List<StudentWithCoursesDto> getAllStudentsWithCourses() {
        List<Student> students = studentRepository.findAll();
        Map<String, String> courseIdTitleMap = courseRepository.findAll().stream()
                .collect(Collectors.toMap(Course::getId, Course::getTitle));

        return students.stream()
                .map(student -> {
                    List<Enrollment> enrollments = enrollmentRepository.findByUserId(student.getUserId());

                    List<EnrollmentWithTitleDto> enrichedEnrollments = enrollments.stream()
                            .map(enrollment -> new EnrollmentWithTitleDto(
                                    enrollment.getCourseId(),
                                    courseIdTitleMap.getOrDefault(enrollment.getCourseId(), "Untitled Course")
                            ))
                            .collect(Collectors.toList());

                    return new StudentWithCoursesDto(
                            student.getId(),
                            student.getFullName(),
                            student.getClassName(),
                            student.getSchoolName(),
                            student.getRollNumber(),
                            student.getFatherName(),
                            student.getMotherName(),
                            enrichedEnrollments
                    );
                })
                .collect(Collectors.toList());
    }

    public String updateStudentById(String studentId, StudentDto dto) {
        return studentRepository.findById(studentId).map(student -> {
            student.setFullName(dto.getFullName());
            student.setRollNumber(dto.getRollNumber());
            student.setSchoolName(dto.getSchoolName());
            student.setClassName(dto.getClassName());
            student.setFatherName(dto.getFatherName());
            student.setMotherName(dto.getMotherName());
            studentRepository.save(student);
            return "Student updated successfully.";
        }).orElseThrow(() -> new RuntimeException("Student not found"));
    }

    public String deleteStudentById(String studentId) {
        if (!studentRepository.existsById(studentId)) {
            throw new RuntimeException("Student not found");
        }
        studentRepository.deleteById(studentId);
        return "Student deleted successfully.";
    }
}
