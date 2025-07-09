package com.studentportal.dto;

import lombok.Data;

@Data
public class CourseDto {
    private String title;
    private String description;
    private String className;
    private double price;
    private String duration;
    private String instructorName;
    private String courseUrl;
    private String thumbnailUrl;
}
