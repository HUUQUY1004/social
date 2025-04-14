package com.social.Social.controller;


import com.social.Social.model.Album;
import com.social.Social.request.AlbumRequest;
import com.social.Social.response.Response;
import com.social.Social.service.AlbumService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
}
