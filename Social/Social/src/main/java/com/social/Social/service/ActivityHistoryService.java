package com.social.Social.service;

import com.social.Social.model.ActivityHistory;
import com.social.Social.responsitory.ActivityHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class ActivityHistoryService implements  ActivityHistoryServiceImp{
    @Autowired
    private ActivityHistoryRepository activityHistoryRepository;
    @Override
    public void createActivityHistory(ActivityHistory activityHistory) throws Exception {
         try {
             activityHistoryRepository.save(activityHistory);
         }
         catch (Exception e){
             throw  new Exception(e.getMessage());
         }
    }

    @Override
    public List<ActivityHistory> getActivityByType(String jwt, String type) throws Exception {
        return null;
    }

    @Override
    public void deleteActivityHistory(Long id) throws Exception {
        try{
            activityHistoryRepository.deleteActivityHistories(id);
        }
        catch (Exception e){
            throw  new Exception(e.getMessage());
        }
    }
}
