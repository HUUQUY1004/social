package com.social.Social.config;


import lombok.Data;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@Getter
public class StringeeConfig {

    @Value("${stringee.sid-key}")
    private String sidKey;

    @Value("${stringee.reset-key}")
    private String resetKey;
}