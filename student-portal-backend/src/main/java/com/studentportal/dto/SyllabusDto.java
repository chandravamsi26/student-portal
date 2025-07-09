package com.studentportal.dto;

import lombok.Data;

import java.util.Map;

@Data
public class SyllabusDto {
    private String id;
    private String className;
    private Map<String, String> subjects;
}
