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
import org.springframework.data.repository.query.Param;
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
            @RequestPart(value = "images", required = false) MultipartFile file,
            @RequestParam(value = "video", required = false) MultipartFile video

            ) throws Exception {
        User user = userService.findUserByToken(jwt);
        System.out.println("Content: " + title);
        Post post = new Post();
//        Image
        Image image = new Image();
        if (file != null && !file.isEmpty()) {

            String imageUrl = fileStorageService.storeFile(file, "post/");
            image.setImageUrl(imageUrl);
        }

        if(video !=null && !video.isEmpty()){
            post.setReel(true);
            String videoUrl = fileStorageService.storeFile(video, "post/");
            image.setImageUrl(videoUrl);
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
        Post post1 = postService.createPost(jwt,post);
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

    @DeleteMapping("/{id}")
    public  ResponseEntity<Response> deletePost(
            @PathVariable("id") Long postId
    ) throws Exception {
        Response response = new Response();
        boolean check = postService.deleteAndBackupPost(postId);
        if(check == true){
            response.setMessage("Success");
            response.setStatus(200);
        }else{
            response.setMessage("Failure");
            response.setStatus(500);
        }
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
    ) throws Exception {
        return ResponseEntity.ok(postService.getQuantityPost(jwt));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<Post>> getPostForUserId(
            @RequestHeader("Authorization") String jwt,
            @PathVariable("userId") Long userId
    ) throws Exception {
        System.out.println("get post for user");
        return  ResponseEntity.ok(postService.getPost(jwt,userId));
    }
    @GetMapping("/trash")
    public  ResponseEntity<List<Post>> getTrash(
            @RequestHeader("Authorization") String jwt
    ) throws Exception {
        return  ResponseEntity.ok(postService.getTrash(jwt));
    }

    @GetMapping("/for-home")
    public  ResponseEntity<List<Post>> getPostHome(
            @RequestHeader("Authorization") String jwt
    ) throws Exception {
        List<Post> postHome = postService.getPostHome(jwt);
        System.out.println(postHome.size());
      return   ResponseEntity.ok(postHome);
    }


    @GetMapping("reels")
    public ResponseEntity<List<Post>> getReel(
            @Param("page") int page
    ) throws Exception {
        System.out.println("page :" +page);
        List<Post> posts = postService.getReel();
        System.out.println(posts.size());
        return  ResponseEntity.ok(posts);
    }


}
