package com.social.Social.controller;

import com.social.Social.model.Image;
import com.social.Social.model.Post;
import com.social.Social.model.PostVisibility;
import com.social.Social.model.User;
import com.social.Social.responsitory.ImageRepository;
import com.social.Social.service.FileStorageService;
import com.social.Social.service.PostService;
import com.social.Social.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Query;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;


@RestController
@RequestMapping(value = "api/post")
public class PostController {
    @Autowired
    FileStorageService fileStorageService;
    @Autowired
    PostService postService;

    @Autowired
    UserService userService;

    @Autowired
    ImageRepository imageRepository;

    @PostMapping(value = "/create", consumes = "multipart/form-data")
    public ResponseEntity<Post> craetePost(
            @RequestHeader("Authorization") String jwt,
            @RequestParam("title") String title,
            @RequestParam("isComment") boolean isComment,
            @RequestParam("isShowLike") boolean isShowLike,
            @RequestParam("postVisibility") String postVisibility,
            @RequestParam("scaleImage") double scaleImage,
            @RequestPart("images") MultipartFile file

            ) throws Exception {
        User user = userService.findUserByToken(jwt);

        Post post = new Post();
//        Image
        Image image = new Image();
        if (file != null && !file.isEmpty()) {
            String imageUrl = fileStorageService.storeFile(file, "post/");
            image.setImageUrl(imageUrl);
        }



        List<Image> imageList = new ArrayList<>();
        imageList.add(image);


        post.setPostVisibility(PostVisibility.valueOf(postVisibility));
        post.setScaleImage(scaleImage);
        post.setTitle(title);
        post.setImages(imageList);
        post.setComment(isComment);
        post.setShowLike(isShowLike);
        post.setUser(user);
        Post post1 = postService.createPost(post);
        image.setPost(post);
        imageRepository.save(image);
        return  ResponseEntity.ok(post1);
    }

    @GetMapping()
    public ResponseEntity<Post> getPostById(
            @RequestParam("id") Long id
    ) throws Exception {
        System.out.println("ALO");
        return ResponseEntity.ok(postService.getPostById(id));
    }
    @GetMapping("quantity")
    public ResponseEntity<Integer> getNumberOfArticles(
            @RequestHeader("Authorization") String jwt
    ){
        return ResponseEntity.ok(0);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<Post>> getPostForUserId(
            @RequestHeader("Authorization") String jwt,
            @PathVariable("userId") Long userId
    ) throws Exception {
        return  ResponseEntity.ok(postService.getPost(jwt,userId));
    }
}
