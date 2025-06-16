package com.social.Social.service.implemenent;

import com.social.Social.model.AdminChat;
import com.social.Social.model.MessageSender;
import com.social.Social.model.Role;
import com.social.Social.model.User;
import com.social.Social.responsitory.AdminChatRepository;
import com.social.Social.service.AdminChatService;
import com.social.Social.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AdminChatServiceImplement implements AdminChatService {

    @Autowired
    private AdminChatRepository adminChatRepository;

    @Autowired
    private UserService userService;

    @Override
    @Transactional
    public AdminChat sendMessageToAdmin(String jwt, String message) throws Exception {
        User user = userService.findUserByToken(jwt);
        
        if (user == null) {
            throw new Exception("User không tồn tại");
        }

        AdminChat chat = AdminChat.builder()
                .user(user)
                .message(message)
                .sender(MessageSender.USER)
                .read(false)
                .createdAt(LocalDateTime.now())
                .build();

        return adminChatRepository.save(chat);
    }

    @Override
    @Transactional
    public AdminChat sendMessageToUser(String jwt, Long userId, String message) throws Exception {
        User admin = userService.findUserByToken(jwt);
        User user = userService.findUserById(userId);
        
        if (admin == null || admin.getRole() != Role.ADMIN) {
            throw new Exception("Chỉ admin mới có thể gửi tin nhắn này");
        }
        
        if (user == null) {
            throw new Exception("User không tồn tại");
        }

        AdminChat chat = AdminChat.builder()
                .user(user)
                .admin(admin)
                .message(message)
                .sender(MessageSender.ADMIN)
                .read(false)
                .createdAt(LocalDateTime.now())
                .build();

        return adminChatRepository.save(chat);
    }

    @Override
    public List<AdminChat> getChatHistory(Long userId) throws Exception {
        return adminChatRepository.findByUserIdOrderByCreatedAtAsc(userId);
    }

    @Override
    public List<User> getChatUsers() throws Exception {
        return adminChatRepository.findDistinctUsersWithChats();
    }

    @Override
    public Long getUnreadMessagesCount(MessageSender sender) throws Exception {
        return adminChatRepository.countUnreadMessages(sender);
    }

    @Override
    public Long getUnreadMessagesCountByUser(Long userId, MessageSender sender) throws Exception {
        return adminChatRepository.countUnreadMessagesByUser(userId, sender);
    }

    @Override
    @Transactional
    public void markMessagesAsRead(Long userId, MessageSender sender) throws Exception {
        adminChatRepository.markMessagesAsRead(userId, sender);
    }

    @Override
    public List<AdminChat> getLatestMessagesByUser() throws Exception {
        return adminChatRepository.findLatestMessagesByUser();
    }
}
