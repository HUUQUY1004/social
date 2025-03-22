package com.social.Social.controller;

import com.social.Social.model.User;
import com.social.Social.service.SearchService;
import com.social.Social.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequestMapping("/api/")
@RestController
public class SearchController {
    @Autowired
    private SearchService searchService;

    @GetMapping("/user/search/{nickname}")
    public ResponseEntity<List<User>> searchUser(
            @PathVariable("nickname") String nickname
    ){
        System.out.println("Search" + nickname +"kq" +searchService.searchUserByName(nickname) );
        return ResponseEntity.ok(searchService.searchUserByName(nickname));
    }
}
