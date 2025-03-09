package com.social.Social.service;

import com.social.Social.model.Message;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public interface MessageService {
    Message saveMessage(Message message);
    List<Message> getMessagesBetweenUsers(Long from, Long to);
}
