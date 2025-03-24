package com.social.Social.responsitory;

import com.social.Social.DTO.FriendRequestDTO;
import com.social.Social.model.FriendRequest;
import com.social.Social.model.RequestStatus;
import com.social.Social.model.User;
import jakarta.persistence.Tuple;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface FriendRequestRepository extends JpaRepository<FriendRequest, Long> {
    @Query("SELECT f FROM FriendRequest f WHERE f.sender = :sender AND f.receiver = :receiver AND f.status = :status")
    Optional<FriendRequest> findBySenderAndReceiver(User sender, User receiver,  @Param("status") RequestStatus status);
    List<FriendRequest> findByReceiverAndStatus(User receiver, RequestStatus status);
    @Query("SELECT f.id, f.sender FROM FriendRequest f WHERE f.receiver = :user and f.status = :status")
    List<Tuple> findAllByReceiver(@Param("user") User user, @Param("status") RequestStatus status);

    @Query("SELECT  f from FriendRequest f where f.id = :id ")
    FriendRequest getFriendRequestById(@Param("id") Long id);
}
