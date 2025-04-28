package com.social.Social.service;

public interface OTPServiceImp {
    String generateOTP(String email);
    boolean verifyOTP(String email, String input);
}
