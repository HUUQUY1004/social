package com.social.Social.response;

import com.social.Social.DTO.AdminChatDto;
import lombok.Data;

import java.util.List;

@Data
public class AdminChatResponse {
    private int status;
    private String message;
    private List<AdminChatDto> chats;
    private AdminChatDto chat;
    private Long unreadCount;
}
