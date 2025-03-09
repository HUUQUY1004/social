package com.social.Social.response;

import com.social.Social.model.User;
import lombok.Data;

import java.util.List;
@Data
public class Invitation {
    private List<User> invitations;
    private int status;
}
