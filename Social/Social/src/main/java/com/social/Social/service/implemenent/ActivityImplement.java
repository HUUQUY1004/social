package com.social.Social.service.implemenent;

import com.social.Social.model.ActivityHistory;
import com.social.Social.model.User;
import com.social.Social.responsitory.ActivityHistoryRepository;
import com.social.Social.service.UserService;
import com.social.Social.service.interfaces.IActivityHistory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class ActivityImplement implements IActivityHistory {
    @Autowired
    private ActivityHistoryRepository activityHistoryRepository;
    @Autowired
    private UserService userService;
    @Override
    public List<ActivityHistory> getActivityHistory(String jwt, int page) throws Exception {
        Pageable pageable = PageRequest.of(page -1, 10);
        User user = userService.findUserByToken(jwt);
        List<ActivityHistory> activityHistories = activityHistoryRepository.getActivityHistories(user.getId(), pageable);
        return  activityHistories;
    }
}
