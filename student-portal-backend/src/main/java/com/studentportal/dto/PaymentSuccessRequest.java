package com.studentportal.dto;

import lombok.Data;

@Data
public class PaymentSuccessRequest {
    private String courseId;
    private String orderId;
    private String paymentId;
    private String status;
}

