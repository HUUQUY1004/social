package com.social.Social.responsitory;

import com.social.Social.model.Notifys;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface NotifyRepository extends JpaRepository<Notifys, Long> {
    @Query("select n from Notifys  n where  n.userId =:userId")
    List<Notifys> getNotifyWithOffset(@Param("userId") Long userId, Pageable pageable);
}
