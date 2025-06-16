package com.social.Social.responsitory;

import com.social.Social.model.AdminChat;
import com.social.Social.model.MessageSender;
import com.social.Social.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdminChatRepository extends JpaRepository<AdminChat, Long> {

    // Lấy tất cả tin nhắn giữa user và admin
    @Query("SELECT ac FROM AdminChat ac WHERE ac.user.id = :userId ORDER BY ac.createdAt ASC")
    List<AdminChat> findByUserIdOrderByCreatedAtAsc(@Param("userId") Long userId);    // Lấy danh sách các cuộc trò chuyện duy nhất (group by user)
    @Query("SELECT DISTINCT ac.user FROM AdminChat ac ORDER BY ac.user.id")
    List<User> findDistinctUsersWithChats();

    // Đếm tin nhắn chưa đọc từ user
    @Query("SELECT COUNT(ac) FROM AdminChat ac WHERE ac.sender = :sender AND ac.read = false")
    Long countUnreadMessages(@Param("sender") MessageSender sender);

    // Đếm tin nhắn chưa đọc từ user cụ thể
    @Query("SELECT COUNT(ac) FROM AdminChat ac WHERE ac.user.id = :userId AND ac.sender = :sender AND ac.read = false")
    Long countUnreadMessagesByUser(@Param("userId") Long userId, @Param("sender") MessageSender sender);

    // Lấy tin nhắn cuối cùng của mỗi user
    @Query("SELECT ac FROM AdminChat ac WHERE ac.createdAt = " +
           "(SELECT MAX(ac2.createdAt) FROM AdminChat ac2 WHERE ac2.user.id = ac.user.id) " +
           "ORDER BY ac.createdAt DESC")
    List<AdminChat> findLatestMessagesByUser();
    
    // Đánh dấu tất cả tin nhắn của user là đã đọc
    @Modifying
    @Query("UPDATE AdminChat ac SET ac.read = true WHERE ac.user.id = :userId AND ac.sender = :sender")
    void markMessagesAsRead(@Param("userId") Long userId, @Param("sender") MessageSender sender);
}
