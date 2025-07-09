package com.studentportal.service;

import com.studentportal.dto.SyllabusDto;
import com.studentportal.entity.Syllabus;
import com.studentportal.entity.Student;
import com.studentportal.repository.SyllabusRepository;
import com.studentportal.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SyllabusService {

    private final SyllabusRepository syllabusRepository;
    private final StudentRepository studentRepository;

    public String addSyllabus(SyllabusDto dto) {
        Syllabus syllabus = Syllabus.builder()
                .className(dto.getClassName())
                .subjects(dto.getSubjects())
                .build();

        syllabusRepository.save(syllabus);
        return "Syllabus added successfully!";
    }

    public SyllabusDto getSyllabusByClassName(String className) {
        Syllabus syllabus = syllabusRepository.findByClassName(className)
                .orElseThrow(() -> new RuntimeException("Syllabus not found"));

        return convertToDto(syllabus);
    }

    public List<SyllabusDto> getAllSyllabus() {
        return syllabusRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public String updateSyllabus(String id, SyllabusDto dto) {
        Syllabus syllabus = syllabusRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Syllabus not found"));

        syllabus.setClassName(dto.getClassName());
        syllabus.setSubjects(dto.getSubjects());

        syllabusRepository.save(syllabus);
        return "Syllabus updated successfully.";
    }

    public void deleteSyllabus(String id) {
        if (!syllabusRepository.existsById(id)) {
            throw new RuntimeException("Syllabus not found");
        }
        syllabusRepository.deleteById(id);
    }

    public List<SyllabusDto> getSyllabusForStudent(String userId) {
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        String className = student.getClassName();

        if ("11".equals(className) || "12".equals(className)) {
            // Show only that class
            return List.of(getSyllabusByClassName(className));
        } else {
            // Show syllabus from class 1 to 10
            return syllabusRepository.findAll().stream()
                    .filter(s -> {
                        try {
                            int cls = Integer.parseInt(s.getClassName());
                            return cls >= 1 && cls <= 10;
                        } catch (NumberFormatException e) {
                            return false;
                        }
                    })
                    .map(this::convertToDto)
                    .collect(Collectors.toList());
        }
    }

    private SyllabusDto convertToDto(Syllabus s) {
        SyllabusDto dto = new SyllabusDto();
        dto.setId(s.getId());
        dto.setClassName(s.getClassName());
        dto.setSubjects(s.getSubjects());
        return dto;
    }
}
