package com.social.Social.request;

import lombok.Data;

@Data
public class VerifyOTPRequest {
    private  String email;
    private  String otp;
}
