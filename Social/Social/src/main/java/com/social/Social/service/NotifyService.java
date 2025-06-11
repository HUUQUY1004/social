package com.social.Social.service;

import com.social.Social.model.Notifys;

import java.util.List;

public interface NotifyService {
    Notifys acpNotifyFriendRequest(String jwt, Long requestId) throws Exception;

    void postNotify(String jwt, Long requestId) throws Exception;


    List<Notifys> getNotifyForUser(String jwt, int page) throws Exception;

    void deleteNotify();
}
