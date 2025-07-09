package com.studentportal.service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import com.studentportal.entity.PaymentOrder;
import com.studentportal.repository.PaymentOrderRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentOrderRepository paymentRepo;

    @Value("${razorpay.key_id}")
    private String keyId;

    @Value("${razorpay.key_secret}")
    private String keySecret;

    public PaymentOrder createRazorpayOrder(String userId, String courseId, double amount) {
        try {

            RazorpayClient razorpay = new RazorpayClient(keyId, keySecret);
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", (int) (amount * 100)); // in paise
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "rcpt_" + UUID.randomUUID().toString().substring(0, 12));
            orderRequest.put("payment_capture", 1);

            Order razorpayOrder = razorpay.orders.create(orderRequest);

            PaymentOrder order = PaymentOrder.builder()
                    .orderId(razorpayOrder.get("id")) // ✅ use Razorpay's orderId
                    .userId(userId)
                    .courseId(courseId)
                    .amount(amount)
                    .status("PENDING")
                    .createdAt(LocalDateTime.now().toString())
                    .build();

            return paymentRepo.save(order);


        } catch (RazorpayException e) {
            throw new RuntimeException("Failed to create Razorpay order: " + e.getMessage());
        }
    }

    public String verifyAndConfirmPayment(String userId, String orderId, String paymentId, String signature) {
        PaymentOrder order = paymentRepo.findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.getUserId().equals(userId)) {
            throw new RuntimeException("Order does not belong to this user");
        }

        try {
            String payload = orderId + "|" + paymentId;

            // Use injected secret
            boolean isValid = Utils.verifySignature(payload, signature, keySecret);

            if (!isValid) {
                order.setStatus("FAILED");
                paymentRepo.save(order);
                return "Invalid signature. Payment verification failed.";
            }

            order.setPaymentId(paymentId);
            order.setStatus("SUCCESS");
            paymentRepo.save(order);

            return "Payment verified and confirmed!";
        } catch (Exception e) {
            e.printStackTrace();
            return "Payment verification failed: " + e.getMessage();
        }
    }
}
