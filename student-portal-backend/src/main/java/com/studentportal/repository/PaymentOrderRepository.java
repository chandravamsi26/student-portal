package com.studentportal.repository;

import com.studentportal.entity.PaymentOrder;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface PaymentOrderRepository extends MongoRepository<PaymentOrder, String> {
    Optional<PaymentOrder> findByOrderId(String orderId);
}


