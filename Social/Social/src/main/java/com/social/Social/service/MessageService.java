package com.social.Social.service;

import com.social.Social.model.Message;
import com.social.Social.request.ShareRequest;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public interface MessageService {
    List<Message> getMessage(String jwt, Long userId) throws Exception;

    List<Message> sharePost(String jwt, ShareRequest shareRequest) throws  Exception;
}
