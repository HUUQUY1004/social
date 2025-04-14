package com.social.Social.controller;


import com.social.Social.request.AlbumRequest;
import com.social.Social.response.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/album")
public class AlbumController {

    @PostMapping("/create")
    public ResponseEntity<Response> craeteAlbum(
            @RequestHeader("Authorization") String jwt,
            @RequestBody AlbumRequest albumRequest
            ){

        Response response = new Response();
        response.setStatus(200);
        response.setMessage("Success");
        return  ResponseEntity.ok(response);
    }
}
