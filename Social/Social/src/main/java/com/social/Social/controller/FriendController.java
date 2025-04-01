package com.social.Social.controller;

import com.social.Social.DTO.FriendRequestDTO;
import com.social.Social.model.FriendRequest;
import com.social.Social.model.User;
import com.social.Social.response.FriendResponse;
import com.social.Social.response.Invitation;
import com.social.Social.responsitory.FriendRequestRepository;
import com.social.Social.service.FriendService;
import com.social.Social.service.NotifyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController()
@RequestMapping("/api/friend")
public class FriendController {
    @Autowired
    private FriendService friendService;
    @Autowired
    private FriendRequestRepository friendRequestRepository;
    @Autowired
    private NotifyService notifyService;


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

//        Add Notify
//        Notify notify = new Notify();
//        notify.setRedirect("/invitation-friends");
//        notify.setUserId(receiverId);
//        notify.setMessage("Bạn có lời mời kết bạn mới");
//        notifyService.addNotify(notify);
        return  new ResponseEntity<>(friendResponse, HttpStatus.OK);

    }

    @PostMapping("reject/{requestId}")
    public ResponseEntity<FriendResponse> rejectRequest(
            @RequestHeader("Authorization") String jwt,
            @PathVariable Long requestId
    ) throws Exception {
        friendService.rejectFriendRequest(requestId);
        FriendResponse friendResponse = new FriendResponse();
        friendResponse.setStatus(200);
        friendResponse.setMessage("Đã từ chối lời mời");
        return  new ResponseEntity<>(friendResponse, HttpStatus.OK);
    }
    @DeleteMapping("delete/{requestId}")
    public ResponseEntity<FriendResponse> deleteRequest(
            @RequestHeader("Authorization") String jwt,
            @PathVariable Long requestId
    ) throws Exception {
        friendService.deleteInvitation(requestId);
        FriendResponse friendResponse = new FriendResponse();
        friendResponse.setStatus(200);
        friendResponse.setMessage("Đã xóa lời mờ");
        return  new ResponseEntity<>(friendResponse, HttpStatus.OK);
    }

    @PostMapping("accept/{requestId}")
    public ResponseEntity<FriendResponse> acceptFriend(
            @RequestHeader("Authorization") String jwt,
            @PathVariable Long requestId
    ) throws Exception {
        friendService.acceptFriendRequest(requestId);
        FriendResponse friendResponse = new FriendResponse();
        friendResponse.setStatus(200);
        friendResponse.setMessage("Đã chấp nhận lời mời kết bạn");

//        Add Notify
        notifyService.acpNotifyFriendRequest(jwt, requestId);
        return  new ResponseEntity<>(friendResponse, HttpStatus.OK);
    }
    @GetMapping("/getInvitation")
    public ResponseEntity<Invitation> getInvitation(
            @RequestHeader("Authorization") String jwt
    ) throws Exception {
        List<FriendRequestDTO> userList = friendService.getListInvitation(jwt);

        Invitation invitation = new Invitation();
        invitation.setInvitations(userList);
        invitation.setStatus(200);
        return  new ResponseEntity<>(invitation, HttpStatus.OK);
    }
    @GetMapping("/quantity")
    public ResponseEntity<Integer> getNumberOfFriend(
            @RequestHeader("Authorization") String jwt
            ) throws Exception {
        return  ResponseEntity.ok(friendService.getNumberOfFriends(jwt));
    }
    @GetMapping({"/{offset}", "/"})
    public  ResponseEntity<List<User>> getFriendForUser(
            @RequestHeader("Authorization") String jwt,
            @PathVariable(value = "offset", required = false) String offset
    ) throws Exception {
        int offsetInt;
        try {
            offsetInt = Integer.parseInt(offset);
        }catch (NumberFormatException e){
            offsetInt = 0;
        }

        return  ResponseEntity.ok(friendService.getListFriend(jwt, offsetInt));
    }


}
