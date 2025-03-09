package com.social.Social.controller;

import com.social.Social.model.FriendRequest;
import com.social.Social.response.FriendResponse;
import com.social.Social.responsitory.FriendRequestRepository;
import com.social.Social.responsitory.UserRepository;
import com.social.Social.service.FriendService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController()
@RequestMapping("/api/friend")
public class FriendController {
    @Autowired
    private FriendService friendService;


    @PostMapping("/add/{receiverId}")
    public ResponseEntity<FriendResponse> addFriend(
            @RequestHeader("Authorization") String jwt,
            @PathVariable Long receiverId
    ) throws Exception {
        System.out.println("receiverId" + receiverId);
        FriendResponse friendResponse = new FriendResponse();
        FriendRequest friendRequest = friendService.sendFriendRequest(jwt, receiverId);
        if(friendRequest !=null){
            friendResponse.setMessage("Gửi thành công");
            friendResponse.setStatus(200);
        }
        else  {
            friendResponse.setMessage("Gửi thất bại");
            friendResponse.setStatus(401);
        }
        return  new ResponseEntity<>(friendResponse, HttpStatus.OK);

    }
}
