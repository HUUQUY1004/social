package com.social.Social.service.interfaces;

import com.social.Social.model.ActivityHistory;

import java.util.List;

public interface IActivityHistory {
    List<ActivityHistory> getActivityHistory(String jwt, int page) throws Exception;
}
