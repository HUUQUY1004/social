package com.social.Social.service;

import com.social.Social.DTO.FriendRequestDTO;
import com.social.Social.model.FriendRequest;
import com.social.Social.model.User;

import java.util.List;

public interface FriendService {
    FriendRequest sendFriendRequest(String jwt, Long receiverId) throws  Exception;

    void acceptFriendRequest (Long requestId) throws  Exception;

    void rejectFriendRequest(Long requestId) throws  Exception;

    void deleteInvitation(Long requestId) throws  Exception;
    List<FriendRequestDTO> getListInvitation(String jwt) throws  Exception;
    List<User> getListFriend(String jwt, int offset) throws Exception;

}
