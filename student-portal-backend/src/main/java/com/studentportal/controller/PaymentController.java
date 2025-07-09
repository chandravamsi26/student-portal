package com.studentportal.controller;

import com.studentportal.entity.PaymentOrder;
import com.studentportal.service.JwtService;
import com.studentportal.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
@CrossOrigin
public class PaymentController {

    private final PaymentService paymentService;
    private final JwtService jwtService;

    @Value("${razorpay.key_id}")
    private String keyId;

    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> createOrder(
            @RequestHeader("Authorization") String token,
            @RequestBody Map<String, Object> request) {

        String userId = jwtService.extractUsername(token.substring(7));
        String courseId = (String) request.get("courseId");
        double amount = Double.parseDouble(request.get("amount").toString());

        PaymentOrder order = paymentService.createRazorpayOrder(userId, courseId, amount);

        Map<String, Object> response = new HashMap<>();
        response.put("orderId", order.getOrderId());
        response.put("amount", order.getAmount());
        response.put("key", keyId); // ✅ send public key to frontend

        return ResponseEntity.ok(response);
    }


    @PostMapping("/confirm")
    public ResponseEntity<String> confirmOrder(
            @RequestHeader("Authorization") String token,
            @RequestBody Map<String, String> payload) {
        String userId = jwtService.extractUsername(token.substring(7));

        String razorpayOrderId = payload.get("razorpay_order_id");
        String razorpayPaymentId = payload.get("razorpay_payment_id");
        String razorpaySignature = payload.get("razorpay_signature");

        String result = paymentService.verifyAndConfirmPayment(userId, razorpayOrderId, razorpayPaymentId, razorpaySignature);
        return ResponseEntity.ok(result);
    }


}
