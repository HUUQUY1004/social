package com.social.Social.controller;

import com.social.Social.DTO.AdminChatDto;
import com.social.Social.model.AdminChat;
import com.social.Social.model.MessageSender;
import com.social.Social.model.User;
import com.social.Social.request.AdminChatRequest;
import com.social.Social.response.AdminChatResponse;
import com.social.Social.service.AdminChatService;
import com.social.Social.service.UserService;
import com.social.Social.util.AdminChatMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/chat")
public class AdminChatController {
    
    @Autowired
    private AdminChatService adminChatService;

    @Autowired
    private UserService userService;    // User gửi tin nhắn đến admin
    @PostMapping("/send-to-admin")
    public ResponseEntity<AdminChatResponse> sendMessageToAdmin(
            @RequestHeader("Authorization") String jwt,
            @RequestBody AdminChatRequest request) throws Exception {
        
        AdminChat chat = adminChatService.sendMessageToAdmin(jwt, request.getMessage());
        
        AdminChatResponse response = new AdminChatResponse();
        response.setStatus(200);
        response.setMessage("Tin nhắn đã được gửi đến admin");
        response.setChat(AdminChatMapper.toDto(chat));
        
        return ResponseEntity.ok(response);
    }

    // Admin gửi tin nhắn đến user
    @PostMapping("/send-to-user")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminChatResponse> sendMessageToUser(
            @RequestHeader("Authorization") String jwt,
            @RequestBody AdminChatRequest request) throws Exception {
        
        AdminChat chat = adminChatService.sendMessageToUser(jwt, request.getUserId(), request.getMessage());
          AdminChatResponse response = new AdminChatResponse();
        response.setStatus(200);
        response.setMessage("Tin nhắn đã được gửi đến user");
        response.setChat(AdminChatMapper.toDto(chat));
        
        return ResponseEntity.ok(response);
    }

    // Lấy lịch sử chat của user hiện tại
    @GetMapping("/my-history")
    public ResponseEntity<AdminChatResponse> getMyChatHistory(
            @RequestHeader("Authorization") String jwt) throws Exception {
          User currentUser = userService.findUserByToken(jwt);
        List<AdminChat> chats = adminChatService.getChatHistory(currentUser.getId());
        
        AdminChatResponse response = new AdminChatResponse();
        response.setStatus(200);
        response.setMessage("Lấy lịch sử chat thành công");
        response.setChats(chats.stream().map(AdminChatMapper::toDto).collect(Collectors.toList()));
        
        return ResponseEntity.ok(response);
    }

    // Lấy lịch sử chat của user cụ thể (Admin only)
    @GetMapping("/history/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminChatResponse> getChatHistory(
            @PathVariable Long userId) throws Exception {
          List<AdminChat> chats = adminChatService.getChatHistory(userId);
        
        AdminChatResponse response = new AdminChatResponse();
        response.setStatus(200);
        response.setMessage("Lấy lịch sử chat thành công");
        response.setChats(chats.stream().map(AdminChatMapper::toDto).collect(Collectors.toList()));
        
        return ResponseEntity.ok(response);
    }

    // Lấy danh sách user đã chat (Admin only)
    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getChatUsers() throws Exception {
        List<User> users = adminChatService.getChatUsers();
        return ResponseEntity.ok(users);
    }

    // Đếm tin nhắn chưa đọc từ user (Admin only)
    @GetMapping("/unread-count")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminChatResponse> getUnreadCount() throws Exception {
        Long count = adminChatService.getUnreadMessagesCount(MessageSender.USER);
        
        AdminChatResponse response = new AdminChatResponse();
        response.setStatus(200);
        response.setMessage("Lấy số tin nhắn chưa đọc thành công");
        response.setUnreadCount(count);
        
        return ResponseEntity.ok(response);
    }

    // Đánh dấu tin nhắn đã đọc (Admin only)
    @PostMapping("/mark-read/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminChatResponse> markAsRead(
            @PathVariable Long userId) throws Exception {
        
        adminChatService.markMessagesAsRead(userId, MessageSender.USER);
        
        AdminChatResponse response = new AdminChatResponse();
        response.setStatus(200);
        response.setMessage("Đã đánh dấu tin nhắn là đã đọc");
        
        return ResponseEntity.ok(response);
    }

    // Lấy tin nhắn cuối cùng của các user (Admin only)
    @GetMapping("/latest-messages")
    @PreAuthorize("hasRole('ADMIN')")    public ResponseEntity<AdminChatResponse> getLatestMessages() throws Exception {
        List<AdminChat> chats = adminChatService.getLatestMessagesByUser();
        
        AdminChatResponse response = new AdminChatResponse();
        response.setStatus(200);
        response.setMessage("Lấy tin nhắn cuối cùng thành công");
        response.setChats(chats.stream().map(AdminChatMapper::toDto).collect(Collectors.toList()));
        
        return ResponseEntity.ok(response);
    }
}
