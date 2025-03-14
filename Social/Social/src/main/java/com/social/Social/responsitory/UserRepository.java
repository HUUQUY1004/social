package com.social.Social.responsitory;

import com.social.Social.model.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserRepository  extends JpaRepository<User, Long> {
    User findByEmail(String email);

    @Modifying
    @Transactional
    @Query("update  User  u set  u.avatar = :avatar where  u.id = :userId")
    int updateAvatar(@Param("userId") Long userId, @Param("avatar") String avatar);

    @Modifying
    @Transactional
    @Query("update  User  u set u.banner = :banner where  u.id= :userId")
    int updateBanner(@Param("userId") Long userId, @Param("banner") String banner);

    @Modifying
    @Transactional
    @Query("update User u set  u.description = :description where  u.id = :userId")
    int updateDescription(@Param("userId") Long userId, @Param("description") String description);
}
