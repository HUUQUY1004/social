package com.social.Social.request;

import lombok.Data;

@Data
public class ChangePassword {
    private String email;
    private String password;
    private String confirmPassword;
}
