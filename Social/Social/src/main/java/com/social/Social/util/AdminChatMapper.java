package com.social.Social.util;

import com.social.Social.DTO.AdminChatDto;
import com.social.Social.model.AdminChat;

public class AdminChatMapper {
    
    public static AdminChatDto toDto(AdminChat chat) {
        if (chat == null) {
            return null;
        }
          return AdminChatDto.builder()
                .id(chat.getId())
                .userId(chat.getUser() != null ? chat.getUser().getId() : null)
                .userName(chat.getUser() != null ? chat.getUser().getUsername() : null)
                .userAvatar(chat.getUser() != null ? chat.getUser().getAvatar() : null)
                .adminId(chat.getAdmin() != null ? chat.getAdmin().getId() : null)
                .adminName(chat.getAdmin() != null ? chat.getAdmin().getUsername() : null)
                .message(chat.getMessage())
                .sender(chat.getSender())
                .read(chat.isRead())
                .createdAt(chat.getCreatedAt())
                .updatedAt(chat.getUpdatedAt())
                .build();
    }
}
