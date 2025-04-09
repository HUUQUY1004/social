package com.social.Social.controller;

import com.social.Social.model.User;
import com.social.Social.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping("/{userId}")
    public ResponseEntity<User> getUserById(
            @PathVariable("userId") Long userId
    ) throws Exception {

        System.out.println("userId" + userId);
        return  ResponseEntity.ok(userService.getUserById(userId));
    }
}
