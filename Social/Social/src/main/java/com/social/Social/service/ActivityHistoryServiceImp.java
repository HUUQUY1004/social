package com.social.Social.service;

import com.social.Social.model.ActivityHistory;

import java.util.List;

public interface ActivityHistoryServiceImp {
    void createActivityHistory(ActivityHistory activityHistory) throws  Exception;

    List<ActivityHistory> getActivityByType(String jwt, String type) throws  Exception;

    void deleteActivityHistory(Long id) throws  Exception;
}
