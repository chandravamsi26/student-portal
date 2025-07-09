package com.studentportal.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("payment_orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentOrder {
    @Id
    private String id;
    private String orderId;
    private String userId;
    private String courseId;
    private double amount;
    private String status;
    private String createdAt;
    private String paymentId;
}

