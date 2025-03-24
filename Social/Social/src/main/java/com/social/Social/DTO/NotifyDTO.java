package com.social.Social.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class NotifyDTO {
    private String message;
    private String redirect;
    private Long userId;
}
