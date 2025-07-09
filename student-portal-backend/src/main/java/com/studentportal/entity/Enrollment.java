package com.studentportal.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("enrollments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Enrollment {
    @Id
    private String id;
    private String userId;
    private String courseId;
    private String courseTitle;
    private String paymentStatus;
    private String enrolledAt;
}

