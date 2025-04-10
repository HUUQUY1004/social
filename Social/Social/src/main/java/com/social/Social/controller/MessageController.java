package com.social.Social.controller;

import com.social.Social.model.Message;
import com.social.Social.model.User;
import com.social.Social.request.MessageRequest;
import com.social.Social.request.ShareRequest;
import com.social.Social.responsitory.MessageRepository;
import com.social.Social.service.FileStorageService;
import com.social.Social.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
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
    @Autowired
    private  MessageService messageService;
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @GetMapping("/conversation/{toUserId}")
    public List<Message> getConversation(
            @RequestHeader("Authorization") String jwt,
            @PathVariable("toUserId") Long toUserId) throws Exception {
        return messageService.getMessage(jwt, toUserId);
    }
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

        messagingTemplate.convertAndSend("/topic/messages/" + toUserId, savedMessage);
        return ResponseEntity.ok(savedMessage);
    }

    @PostMapping("/share")
    public ResponseEntity<List<Message>> sharePost(
            @RequestHeader("Authorization") String jwt,
            @RequestBody ShareRequest shareRequest
    ) throws Exception {
        return  ResponseEntity.ok(messageService.sharePost(jwt,shareRequest));
    }


}
