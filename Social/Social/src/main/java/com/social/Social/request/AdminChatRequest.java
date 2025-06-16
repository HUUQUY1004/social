package com.social.Social.request;

import lombok.Data;

@Data
public class AdminChatRequest {
    private String message;
    private Long userId; // Chỉ dùng khi admin gửi tin nhắn đến user cụ thể
}
