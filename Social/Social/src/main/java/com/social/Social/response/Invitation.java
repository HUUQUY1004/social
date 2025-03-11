package com.social.Social.response;

import com.social.Social.DTO.FriendRequestDTO;
import com.social.Social.model.User;
import lombok.Data;

import java.util.List;
@Data
public class Invitation {
    private List<FriendRequestDTO> invitations;
    private int status;
}
