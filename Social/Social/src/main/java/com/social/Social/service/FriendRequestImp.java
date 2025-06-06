package com.social.Social.service;

import com.social.Social.DTO.FriendRequestDTO;
import com.social.Social.model.*;
import com.social.Social.responsitory.FriendRequestRepository;
import com.social.Social.responsitory.UserRepository;
import jakarta.persistence.Tuple;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FriendRequestImp implements  FriendService{
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private FriendRequestRepository friendRequestRepository;
    @Autowired
    private UserService userService;


    @Autowired
    private ActivityHistoryService activityHistoryService;
    @Override
    public FriendRequest sendFriendRequest(String jwt, Long receiverId) throws Exception {

        User sender = userService.findUserByToken(jwt);
        User receiver = userRepository
                .findById(receiverId)
                .orElseThrow(() -> new RuntimeException("Người nhận không tồn tại"));

        if (friendRequestRepository.findBySenderAndReceiver(sender, receiver,RequestStatus.PENDING).isPresent()) {
            throw new RuntimeException("Đã gửi yêu cầu kết bạn rồi!");
        }
        if(sender.getId() == receiverId){
            throw  new RuntimeException(("Không thể gửi yêu cầu cho chính mình"));
        }

        FriendRequest request = new FriendRequest();
        request.setSender(sender);
        request.setReceiver(receiver);
        request.setStatus(RequestStatus.PENDING);
        return friendRequestRepository.save(request);
    }

    @Override
    public void acceptFriendRequest(Long requestId) throws Exception {

        FriendRequest request = friendRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy yêu cầu kết bạn"));

        request.setStatus(RequestStatus.ACCEPTED);
        friendRequestRepository.save(request);



        User sender = request.getSender();
        User receiver = request.getReceiver();

        // Đảm bảo danh sách bạn bè không bị null
        if (sender.getFriends() == null) {
            sender.setFriends(new ArrayList<>());
        }
        if (receiver.getFriends() == null) {
            receiver.setFriends(new ArrayList<>());
        }

//         Activity
        ActivityHistory activityHistory = new ActivityHistory().builder().
                content("Bạn đã chất nhận lời mời của "+ sender.getUsername())
                .activityType(EnumActivity.FRIENDS)
                .isDelete(false)
                .link(String.valueOf(sender.getId())).
                build();

        sender.getFriends().add(receiver);
        receiver.getFriends().add(sender);
        userRepository.save(sender);
        userRepository.save(receiver);
    }

    @Override
    public void rejectFriendRequest(Long requestId) throws Exception {
        FriendRequest request = friendRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy yêu cầu kết bạn"));
        request.setStatus(RequestStatus.REJECTED);
        friendRequestRepository.save(request);
    }

    @Override
    public void deleteInvitation(Long requestId) throws Exception {
        FriendRequest request = friendRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy yêu cầu kết bạn"));
        friendRequestRepository.delete(request);
    }

    @Override
    public void deleteFriend(String jwt, Long userId) throws Exception {
        User user = userService.findUserByToken(jwt);
        User deleteUser = userRepository.findById(userId).orElseThrow(()-> new Exception("Không tìm thấy"));
        if(user.getId().equals(userId)){
            throw  new Exception("Không thể xóa chính mình!");
        }
        Optional<User> userOptional = user.getFriends().stream()
                .filter(u -> u.getId().equals(userId))
                .findFirst();

        if (userOptional.isPresent()) {
            User foundUser = userOptional.get();
        } else {
            throw new Exception("Không tìm thấy user với id: " + userId);
        }
        user.getFriends().remove(deleteUser);
        deleteUser.getFriends().remove(user);

//        Activity
        ActivityHistory activityHistory =  new ActivityHistory().builder().
        content("Bạn đã xóa " + deleteUser.getUsername() + " ra khỏi danh sách bạn bè.")
                .activityType(EnumActivity.FRIENDS)
                        .isDelete(false).
                link(String.valueOf(deleteUser.getId())).
                build();

        userRepository.save(user);
        userRepository.save(deleteUser);

    }

    @Override
    public List<FriendRequestDTO> getListInvitation(String jwt) throws Exception {
       User user = userService.findUserByToken(jwt);
        List<Tuple> results = friendRequestRepository.findAllByReceiver(user, RequestStatus.PENDING);

        return  results.stream().map(tuple -> new FriendRequestDTO(
                tuple.get(0, Long.class),
                tuple.get(1, User.class)
        )).collect(Collectors.toList());

    }

    @Override
    public List<User> getListFriend(String jwt, int offset) throws Exception {
        User user = userService.findUserByToken(jwt);
        Pageable pageable = PageRequest.of(offset, 10);
        List<User> frs = userRepository.getFriend(user.getId(), pageable);
        return  frs;
    }

    @Override
    public Integer getNumberOfFriends(String jwt) throws Exception {
        User user = userService.findUserByToken(jwt);
        return  user.getFriends().size();
    }
}
