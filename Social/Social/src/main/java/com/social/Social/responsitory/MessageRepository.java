package com.social.Social.responsitory;

import com.social.Social.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    @Query("SELECT m FROM Message m WHERE (m.fromUser = :fromUser AND m.toUserId = :toUserId) OR (m.fromUser = :toUserId AND m.toUserId = :fromUser) ORDER BY m.timestamp ASC")
    List<Message> getConversation(@Param("fromUser") Long fromUser, @Param("toUserId") Long toUserId);

}
