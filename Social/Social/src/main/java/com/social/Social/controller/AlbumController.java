package com.social.Social.controller;


import com.social.Social.model.Album;
import com.social.Social.request.AddPostToAlbumRequest;
import com.social.Social.request.AlbumRequest;
import com.social.Social.response.Response;
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

    @PostMapping("/create")
    public ResponseEntity<Response> craeteAlbum(
            @RequestHeader("Authorization") String jwt,
            @RequestBody AlbumRequest albumRequest
            ) throws Exception {

        Response response = new Response();
        Album album = albumService.createAlbum(jwt,albumRequest);
        if(album !=null){
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
        response.setStatus(200);
        response.setMessage("Success");
        return  ResponseEntity.ok(response);
    }
}
