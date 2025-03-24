package com.social.Social.service;

import com.social.Social.model.Notify;

public interface NotifyService {
    Notify acpNotifyFriendRequest(String jwt, Long requestId) throws Exception;


    void deleteNotify();
}
