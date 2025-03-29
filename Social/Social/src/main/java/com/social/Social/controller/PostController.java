package com.social.Social.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping(value = "api/post")
public class PostController {

    @GetMapping("quantity")
    public ResponseEntity<Integer> getNumberOfArticles(
            @RequestHeader("Authorization") String jwt
    ){
        return ResponseEntity.ok(0);
    }
}
