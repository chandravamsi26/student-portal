package com.studentportal.util;

import java.util.HashMap;
import java.util.Map;

public class OtpStore {
    private static final Map<String, String> otpMap = new HashMap<>();

    public static void storeOtp(String userId, String otp) {
        otpMap.put(userId, otp);
    }

    public static String getOtp(String userId) {
        return otpMap.get(userId);
    }

    public static void removeOtp(String userId) {
        otpMap.remove(userId);
    }
}
