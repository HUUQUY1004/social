package com.social.Social.controller;

import com.social.Social.model.User;
import com.social.Social.request.UserChangePassword;
import com.social.Social.response.Response;
import com.social.Social.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("change-password")
    public  ResponseEntity<Response> changePassword(
            @RequestHeader("Authorization") String jwt,
            @RequestBody UserChangePassword userChangePassword) throws Exception {
         userService.changePassword(jwt, userChangePassword);
        Response response = new Response();
        response.setStatus(200);
        response.setMessage("Thay đổi mật khẩu thành công");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<User> getUserById(
            @PathVariable("userId") Long userId
    ) throws Exception {

        System.out.println("userId" + userId);
        return  ResponseEntity.ok(userService.getUserById(userId));
    }
}
