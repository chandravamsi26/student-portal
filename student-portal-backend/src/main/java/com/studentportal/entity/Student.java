package com.studentportal.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "students")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Student {
    @Id
    private String id;

    private String userId;
    private String fullName;
    private String rollNumber;
    private String schoolName;
    private String className;
    private String fatherName;
    private String motherName;

    private boolean formSubmitted;
}
