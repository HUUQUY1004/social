package com.social.Social.controller;

import com.social.Social.model.Image;
import com.social.Social.model.Post;
import com.social.Social.model.PostVisibility;
import com.social.Social.model.User;
import com.social.Social.request.CommentPost;
import com.social.Social.request.LikePost;
import com.social.Social.response.Response;
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
    @PostMapping("likePost")
    public  ResponseEntity<Response> likePost(
            @RequestHeader("Authorization") String jwt,
            @RequestBody LikePost likePost
            ) throws Exception {
        System.out.println(likePost.getPostId());
        boolean check = postService.likePost(jwt,likePost.getPostId());
        Response response = new Response();
        response.setStatus(200);
        if(check){
            response.setMessage("Like Successfully");
        }
        else {
            response.setMessage("DisLike Successfully");
        }
        return ResponseEntity.ok((response));
    }
    @PostMapping("comment")
    public  ResponseEntity<Response> comment(
            @RequestHeader("Authorization") String jwt,
            @RequestBody()CommentPost commentPost
            ) throws Exception {
        postService.commentPost(jwt,commentPost);
        Response response = new Response();
        response.setStatus(200);
        response.setMessage("Success");
        return  ResponseEntity.ok(response);
    }
    @GetMapping()
    public ResponseEntity<Post> getPostById(
            @RequestParam("id") Long id
    ) throws Exception {
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
