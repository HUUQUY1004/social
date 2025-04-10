package com.social.Social.service;

import com.social.Social.model.Message;
import com.social.Social.model.User;
import com.social.Social.request.ShareRequest;
import com.social.Social.responsitory.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
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

    @Override
    public List<Message> sharePost(String jwt, ShareRequest shareRequest) throws Exception {
        List<Message> messages = new ArrayList<>();
        User user = userService.findUserByToken(jwt);
        for(Long userId: shareRequest.getSelectedFriends()){
            Message message = new Message();
            message.setContent(shareRequest.getContent());
            message.setFromUser(user.getId());
            message.setToUserId(userId);

            Message save = messageRepository.save(message);
            messages.add(save);
        }
        return  messages;
    }
}
