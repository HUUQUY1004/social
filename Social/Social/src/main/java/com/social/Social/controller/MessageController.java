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


    @PostMapping(value = "/send", consumes = "multipart/form-data")
    public ResponseEntity<Message> sendMessage(
            @RequestParam("formUser") Long formUser,
            @RequestParam("toUserId") Long toUserId,
            @RequestParam(value = "content", required = false) String content,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @RequestPart(value = "video", required = false) MultipartFile video
    ) {

        Message message = new Message();
        message.setFromUser(formUser);
        message.setToUserId(toUserId);
        message.setContent(content);
        if (image != null && !image.isEmpty()) {
            String imageUrl = fileStorageService.storeFile(image, "images/");
            message.setImageUrl(imageUrl);
        }
        if (video!= null && !video.isEmpty()) {
            String videoUrl = fileStorageService.storeFile(video, "videos/");
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
