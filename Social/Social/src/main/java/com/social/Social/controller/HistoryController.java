package com.social.Social.controller;

import com.social.Social.model.ActivityHistory;
import com.social.Social.service.interfaces.IActivityHistory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.repository.query.Param;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/history")
@RequiredArgsConstructor
public class HistoryController {

    private  final IActivityHistory activityHistory;

    @GetMapping()
    public ResponseEntity<List<ActivityHistory>> getHistory(
            @RequestHeader("Authorization") String jwt,
            @Param("page") int page
    ) throws Exception {
        return  ResponseEntity.ok(activityHistory.getActivityHistory(jwt,page));
    }
}
