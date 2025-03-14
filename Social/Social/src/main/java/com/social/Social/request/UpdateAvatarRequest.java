package com.social.Social.request;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class UpdateAvatarRequest {
    private String title;
    private MultipartFile avatar;
}
