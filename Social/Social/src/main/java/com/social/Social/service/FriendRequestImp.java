package com.social.Social.service;

import com.social.Social.DTO.FriendRequestDTO;
import com.social.Social.model.FriendRequest;
import com.social.Social.model.RequestStatus;
import com.social.Social.model.User;
import com.social.Social.responsitory.FriendRequestRepository;
import com.social.Social.responsitory.UserRepository;
import jakarta.persistence.Tuple;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FriendRequestImp implements  FriendService{
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private FriendRequestRepository friendRequestRepository;
    @Autowired
    private UserService userService;
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
    public List<FriendRequestDTO> getListInvitation(String jwt) throws Exception {
       User user = userService.findUserByToken(jwt);
        List<Tuple> results = friendRequestRepository.findAllByReceiver(user, RequestStatus.PENDING);

        return  results.stream().map(tuple -> new FriendRequestDTO(
                tuple.get(0, Long.class),
                tuple.get(1, User.class)
        )).collect(Collectors.toList());

    }
}
