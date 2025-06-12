package com.social.Social.request;

import lombok.Data;

@Data
public class UserChangePassword {
    private String currentPassword;
    private String newPassword;
    private String  confirmPassword;
}
