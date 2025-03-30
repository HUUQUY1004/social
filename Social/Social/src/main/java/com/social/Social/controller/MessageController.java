package com.social.Social.controller;

import com.social.Social.model.Message;
import com.social.Social.request.MessageRequest;
import com.social.Social.responsitory.MessageRepository;
import com.social.Social.service.FileStorageService;
import com.social.Social.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "http://localhost:3000")
public class MessageController {
    @Autowired
    private MessageRepository messageRepository;
    @Autowired
    private  FileStorageService fileStorageService;


    @PostMapping("/send")
    public ResponseEntity<Message> sendMessage(@RequestBody MessageRequest messageRequest) {

        Message message = new Message();
        message.setFromUser(message.getFromUser());
        message.setToUserId(messageRequest.getToUserId());
        message.setContent(message.getContent());
        if (messageRequest.getImage() != null && !messageRequest.getImage().isEmpty()) {
            String imageUrl = fileStorageService.storeFile(messageRequest.getImage(), "images/");
            message.setImageUrl(imageUrl);
        }
        if (messageRequest.getVideo() != null && !messageRequest.getVideo().isEmpty()) {
            String videoUrl = fileStorageService.storeFile(messageRequest.getVideo(), "videos/");
            message.setVideoUrl(videoUrl);
        }

        Message savedMessage = messageRepository.save(message);
        return ResponseEntity.ok(savedMessage);
    }

//    @GetMapping("/conversation")
//    public List<Message> getConversation(@RequestParam Long fromUserId, @RequestParam Long toUserId) {
//        return messageService.getMessagesBetweenUsers(fromUserId, toUserId);
//    }
}
