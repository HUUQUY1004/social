package com.social.Social.service;

import com.social.Social.model.Message;
import com.social.Social.model.User;
import com.social.Social.responsitory.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class MessageServiceImp implements  MessageService{
    @Autowired
    private  UserService userService;

    @Autowired
    private MessageRepository messageRepository;
    @Override
    public List<Message> getMessage(String jwt, Long userId) throws Exception {
        User user = userService.findUserByToken(jwt);
        List<Message> conversation = messageRepository.getConversation(user.getId(), userId);
        return  conversation;
    }
}
