package com.studentportal.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Map;

@Document("syllabus")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Syllabus {
    @Id
    private String id;
    private String className;
    private Map<String, String> subjects;
}
