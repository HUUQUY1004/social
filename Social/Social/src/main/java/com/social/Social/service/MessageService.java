package com.social.Social.service;

import com.social.Social.model.Message;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public interface MessageService {
    List<Message> getMessage(String jwt, Long userId) throws Exception;
}
