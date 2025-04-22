package com.social.Social.controller;

import com.social.Social.config.JwtConstant;
import com.social.Social.model.User;
import com.social.Social.service.StringeeService;
import com.social.Social.service.UserService;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;

@RestController
@RequestMapping("/api/stringee")
public class StringeeController {
    @Autowired
    StringeeService stringeeService;
    @GetMapping("/token")
    public ResponseEntity<String> getToken(
            @RequestHeader("Authorization") String jwt
    ) throws Exception {
        System.out.println("run");
        return  ResponseEntity.ok(stringeeService.getToken(jwt));
    }

}
