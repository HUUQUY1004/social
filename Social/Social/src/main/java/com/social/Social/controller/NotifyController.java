package com.social.Social.controller;

import com.social.Social.model.Notifys;
import com.social.Social.service.NotifyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notify")
public class NotifyController {
    @Autowired
    private NotifyService notifyService;

    @GetMapping({"/{offset}", "/"})
    public ResponseEntity<List<Notifys>> getNotify(
            @RequestHeader("Authorization") String jwt,
            @PathVariable(value = "offset", required = false) String offset
    ) throws Exception {
        int offsetInt;
        try {
            offsetInt = Integer.parseInt(offset);
        }catch (NumberFormatException e){
            offsetInt = 0;
        }
        return  ResponseEntity.ok(notifyService.getNotifyForUser(jwt, offsetInt));
    }
}
