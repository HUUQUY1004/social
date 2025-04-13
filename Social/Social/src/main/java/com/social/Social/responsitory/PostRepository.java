package com.social.Social.responsitory;

import com.social.Social.model.Post;
import com.social.Social.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PostRepository  extends JpaRepository<Post, Long> {
    List<Post> getPostByUserId(Long userId);

    @Query("""
    SELECT DISTINCT p FROM Post p
    LEFT JOIN FETCH p.images
    WHERE p.user.id = :ownerId and p.isDelete = false 
      AND (
        :requesterId = :ownerId
        OR (
          EXISTS (
            SELECT 1 FROM User u
            JOIN u.friends f
            WHERE u.id = :requesterId AND f.id = :ownerId
          )
          AND p.postVisibility <> 'PRIVATE'
        )
        OR (
          NOT EXISTS (
            SELECT 1 FROM User u
            JOIN u.friends f
            WHERE u.id = :requesterId AND f.id = :ownerId
          )
          AND p.postVisibility = 'PUBLIC'
        )
      )
""")
    List<Post> getVisiblePostsWithImages(@Param("ownerId") Long ownerId, @Param("requesterId") Long requesterId);

    @Query("select  count(*) from Post  p where  p.user = :user")
    int getQuantityPost(User user);

    @Query(
            "SELECT p FROM Post p LEFT JOIN FETCH p.images " +
                    "WHERE p.isDelete = false " +
                    "AND p.postVisibility <> 'PRIVATE' " +
                    "AND EXISTS (" +
                    "SELECT 1 FROM User u " +
                    "JOIN u.friends f " +
                    "WHERE u.id = :userId AND f.id = p.user.id " +
                    ")"
    )
    List<Post> getPostHome(@Param("userId") Long userId);

}
