//package com.social.Social.controller;
//
//import com.social.Social.model.Message;
//import com.social.Social.service.FileStorageService;
//import com.social.Social.service.MessageService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//import org.springframework.web.multipart.MultipartFile;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/messages")
//@CrossOrigin(origins = "http://localhost:3000")
//public class MessageController {
//    private final MessageService messageService;
//    private final FileStorageService fileStorageService;
//
//    @Autowired
//    public MessageController(MessageService messageService, FileStorageService fileStorageService) {
//        this.messageService = messageService;
//        this.fileStorageService = fileStorageService;
//    }
//
//    @PostMapping("/send")
//    public ResponseEntity<Message> sendMessage(@RequestBody messageRequest) {
//
//        Message message = new Message();
//        message.setFrom(fromUserId);
//        message.setTo(toUserId);
//        message.setContent(content);
//        if (image != null && !image.isEmpty()) {
//            String imageUrl = fileStorageService.storeFile(image, "images/");
//            message.setImageUrl(imageUrl);
//        }
//        if (video != null && !video.isEmpty()) {
//            String videoUrl = fileStorageService.storeFile(video, "videos/");
//            message.setVideoUrl(videoUrl);
//        }
//
//        Message savedMessage = messageService.saveMessage(message);
//        return ResponseEntity.ok(savedMessage);
//    }
//
//    @GetMapping("/conversation")
//    public List<Message> getConversation(@RequestParam Long fromUserId, @RequestParam Long toUserId) {
//        return messageService.getMessagesBetweenUsers(fromUserId, toUserId);
//    }
//}
