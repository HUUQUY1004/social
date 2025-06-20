package com.social.Social.responsitory;

import com.social.Social.model.ActivityHistory;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ActivityHistoryRepository extends JpaRepository<ActivityHistory, Long> {

    @Transactional
    @Query("update ActivityHistory  a set a.isDelete= false where a.id= :id ")
    void deleteActivityHistories(Long id);

    @Query("select a from  ActivityHistory a where  a.userId =:userId")
    List<ActivityHistory> getActivityHistories(Long userId, Pageable pageable);
}
