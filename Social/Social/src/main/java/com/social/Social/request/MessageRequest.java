package com.social.Social.request;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;
@Data
@NoArgsConstructor
public class MessageRequest {

    private  Long fromUserId;
    private  Long toUserId;

    private String content;
    private MultipartFile image;
    private MultipartFile video;
}
