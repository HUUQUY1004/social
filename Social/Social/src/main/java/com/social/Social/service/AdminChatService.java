package com.social.Social.service;

import com.social.Social.model.AdminChat;
import com.social.Social.model.MessageSender;
import com.social.Social.model.User;

import java.util.List;

public interface AdminChatService {
    
    // Gửi tin nhắn từ user đến admin
    AdminChat sendMessageToAdmin(String jwt, String message) throws Exception;
    
    // Gửi tin nhắn từ admin đến user
    AdminChat sendMessageToUser(String jwt, Long userId, String message) throws Exception;
    
    // Lấy tất cả tin nhắn giữa user và admin
    List<AdminChat> getChatHistory(Long userId) throws Exception;
    
    // Lấy danh sách các cuộc trò chuyện cho admin
    List<User> getChatUsers() throws Exception;
    
    // Đếm tin nhắn chưa đọc
    Long getUnreadMessagesCount(MessageSender sender) throws Exception;
    
    // Đếm tin nhắn chưa đọc từ user cụ thể
    Long getUnreadMessagesCountByUser(Long userId, MessageSender sender) throws Exception;
    
    // Đánh dấu tin nhắn đã đọc
    void markMessagesAsRead(Long userId, MessageSender sender) throws Exception;
    
    // Lấy tin nhắn cuối cùng của các user
    List<AdminChat> getLatestMessagesByUser() throws Exception;
}
