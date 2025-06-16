package com.social.Social.controller;

import com.social.Social.DTO.AdminChatDto;
import com.social.Social.model.AdminChat;
import com.social.Social.model.MessageSender;
import com.social.Social.request.AdminChatRequest;
import com.social.Social.service.AdminChatService;
import com.social.Social.service.UserService;
import com.social.Social.util.AdminChatMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class AdminChatWebSocketController {

    @Autowired
    private AdminChatService adminChatService;

    @Autowired
    private UserService userService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;    // User gửi tin nhắn đến admin qua WebSocket
    @MessageMapping("/chat.sendToAdmin")
    public void sendMessageToAdmin(@Payload AdminChatRequest chatRequest, SimpMessageHeaderAccessor headerAccessor) {
        try {
            // Lấy JWT từ session attributes (đã được set bởi WebSocketAuthInterceptor)
            String jwt = (String) headerAccessor.getSessionAttributes().get("jwt");
            
            if (jwt == null || jwt.trim().isEmpty()) {
                System.err.println("JWT token not found in WebSocket session");
                return;
            }

            AdminChat chat = adminChatService.sendMessageToAdmin(jwt, chatRequest.getMessage());
            AdminChatDto chatDto = AdminChatMapper.toDto(chat);

            // Gửi tin nhắn đến tất cả admin
            messagingTemplate.convertAndSend("/topic/admin/messages", chatDto);
            
            // Gửi xác nhận lại cho user
            messagingTemplate.convertAndSendToUser(
                chat.getUser().getId().toString(), 
                "/queue/chat", 
                chatDto
            );
        } catch (Exception e) {
            System.err.println("Error sending message to admin: " + e.getMessage());
            e.printStackTrace();
        }
    }    // Admin gửi tin nhắn đến user qua WebSocket
    @MessageMapping("/chat.sendToUser")
    public void sendMessageToUser(@Payload AdminChatRequest chatRequest, SimpMessageHeaderAccessor headerAccessor) {
        try {
            // Lấy JWT từ session attributes (đã được set bởi WebSocketAuthInterceptor)
            String jwt = (String) headerAccessor.getSessionAttributes().get("jwt");
            
            if (jwt == null || jwt.trim().isEmpty()) {
                System.err.println("JWT token not found in WebSocket session for sendToUser");
                return;
            }

            AdminChat chat = adminChatService.sendMessageToUser(jwt, chatRequest.getUserId(), chatRequest.getMessage());
            AdminChatDto chatDto = AdminChatMapper.toDto(chat);

            // Gửi tin nhắn đến user cụ thể
            messagingTemplate.convertAndSendToUser(
                chatRequest.getUserId().toString(), 
                "/queue/chat", 
                chatDto
            );

            // Gửi tin nhắn đến tất cả admin
            messagingTemplate.convertAndSend("/topic/admin/messages", chatDto);
        } catch (Exception e) {
            System.err.println("Error sending message to user: " + e.getMessage());
            e.printStackTrace();
        }
    }

    // Đánh dấu tin nhắn đã đọc
    @MessageMapping("/chat.markAsRead")
    public void markMessagesAsRead(@Payload AdminChatRequest chatRequest, SimpMessageHeaderAccessor headerAccessor) {
        try {
            adminChatService.markMessagesAsRead(chatRequest.getUserId(), MessageSender.USER);
            
            // Thông báo đến admin về việc đã đọc tin nhắn
            messagingTemplate.convertAndSend("/topic/admin/read/" + chatRequest.getUserId(), "READ");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
