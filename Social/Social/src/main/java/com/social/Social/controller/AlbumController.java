package com.social.Social.controller;


import com.social.Social.model.ActivityHistory;
import com.social.Social.model.Album;
import com.social.Social.model.EnumActivity;
import com.social.Social.request.AddPostToAlbumRequest;
import com.social.Social.request.AlbumRequest;
import com.social.Social.response.Response;
import com.social.Social.service.ActivityHistoryService;
import com.social.Social.service.AlbumService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/album")
public class AlbumController {
    @Autowired
    AlbumService albumService;

    @Autowired
    ActivityHistoryService activityHistoryService;

    @PostMapping("/create")
    public ResponseEntity<Response> createAlbum(
            @RequestHeader("Authorization") String jwt,
            @RequestBody AlbumRequest albumRequest
            ) throws Exception {

        Response response = new Response();
        Album album = albumService.createAlbum(jwt,albumRequest);
        if(album !=null){
            ActivityHistory activityHistory = new ActivityHistory().builder()
                    .content("Bạn đã tạo ra album:" + albumRequest.getName())
                    .activityType(EnumActivity.PROFILE).
                    isDelete(false).build();
            activityHistoryService.createActivityHistory(activityHistory);
            response.setStatus(200);
            response.setMessage("Success");
        }
        else {
            response.setStatus(500);
            response.setMessage("Failure");
        }
        return  ResponseEntity.ok(response);
    }
    @GetMapping("/all")
    public ResponseEntity<List<Album>> getAllAblum(
            @RequestHeader("Authorization") String jwt
    ) throws Exception {

        return  ResponseEntity.ok(albumService.getAllAlbumForUser(jwt));
    }

    @PostMapping("/saved")
    public ResponseEntity<Response> addPost(
            @RequestHeader("Authorization") String jwt,
            @RequestBody AddPostToAlbumRequest albumRequest
            ) throws Exception {
        Response response = new Response();
        albumService.addPostToAlbum(jwt,albumRequest);
        ActivityHistory activityHistory = new ActivityHistory().builder().
                content("Bạn đã thêm một bài viết vào bộ sưu tập")
                .activityType(EnumActivity.PROFILE)
                .link("p/" + albumRequest.getPostId()).
                isDelete(false).
                build();
        activityHistoryService.createActivityHistory(activityHistory);
        response.setMessage("Success");
        response.setStatus(200);
        return  ResponseEntity.ok(response);
    }



    @GetMapping("/{id}")
    public  ResponseEntity<Album> getAlbumById(
            @PathVariable("id") Long id
    ) throws Exception {
        System.out.println("CC bạn");
        return  ResponseEntity.ok(albumService.getAlbumById(id));
    }
    @DeleteMapping("/{id}")
    public  ResponseEntity<Response> deleteAlbum(
            @PathVariable("id") Long id,
            @RequestHeader("Authorization") String jwt
    ) throws Exception {
        Response response = new Response();

        albumService.deleteAlbum(jwt,id);

        ActivityHistory activityHistory = new ActivityHistory().builder().
                isDelete(false).
                content("Bạn đã xóa một album.").
                activityType(EnumActivity.PROFILE).
                build();
        activityHistoryService.createActivityHistory(activityHistory);
        response.setStatus(200);
        response.setMessage("Success");
        return  ResponseEntity.ok(response);
    }
}
// Activity Done - Sign by HQ