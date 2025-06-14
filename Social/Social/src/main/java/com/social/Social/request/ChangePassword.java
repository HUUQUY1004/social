package com.social.Social.request;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ChangePassword {
    private String email;
    private String password;
    private String confirmPassword;
}
