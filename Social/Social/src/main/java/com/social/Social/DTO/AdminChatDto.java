package com.social.Social.DTO;

import com.social.Social.model.MessageSender;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminChatDto {
    private Long id;
    private Long userId;
    private String userName;
    private String userAvatar;
    private Long adminId;
    private String adminName;
    private String message;
    private MessageSender sender;
    private boolean read;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
