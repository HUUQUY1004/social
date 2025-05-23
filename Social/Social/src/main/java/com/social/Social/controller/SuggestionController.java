package com.social.Social.controller;

import com.social.Social.model.User;
import com.social.Social.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/suggestion")
public class SuggestionController {
    @Autowired
    private UserService userService;

    @GetMapping()
    public ResponseEntity<List<User>> getSuggestion(){
        System.out.println("run");
        return  ResponseEntity.ok(userService.getTenUser());
    }
}
