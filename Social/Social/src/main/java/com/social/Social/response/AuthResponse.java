package com.social.Social.response;

import lombok.Data;

@Data
public class AuthResponse {
    private String jwt;
    private String message;
}
