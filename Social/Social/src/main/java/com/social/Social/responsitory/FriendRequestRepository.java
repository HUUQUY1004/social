package com.social.Social.responsitory;

import com.social.Social.model.FriendRequest;
import com.social.Social.model.RequestStatus;
import com.social.Social.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FriendRequestRepository extends JpaRepository<FriendRequest, Long> {
    Optional<FriendRequest> findBySenderAndReceiver(User sender, User receiver);
    List<FriendRequest> findByReceiverAndStatus(User receiver, RequestStatus status);
}
