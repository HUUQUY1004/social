package com.social.Social.response;

import com.social.Social.model.User;
import lombok.Data;

@Data
public class ProfileResponse {
    private User user;
    private  int status;
}
