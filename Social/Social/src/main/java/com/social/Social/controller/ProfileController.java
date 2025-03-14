package com.social.Social.controller;

import com.social.Social.model.User;
import com.social.Social.request.DescriptionRequest;
import com.social.Social.request.UpdateAvatarRequest;
import com.social.Social.response.ProfileResponse;
import com.social.Social.response.Response;
import com.social.Social.responsitory.UserRepository;
import com.social.Social.service.FileStorageService;
import com.social.Social.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

@RestController()
@RequestMapping("/api/profile")
public class ProfileController {
   @Autowired
    private UserService userService;
   @Autowired
   private UserRepository userRepository;

   @Autowired
   private FileStorageService fileStorageService;

   @GetMapping("my-profile")
   public ResponseEntity<ProfileResponse> getMyProfile(
           @RequestHeader("Authorization") String jwt
   ) throws Exception {
       User user = userService.findUserByToken(jwt);

       ProfileResponse profileResponse = new ProfileResponse();
       profileResponse.setStatus(200);
       profileResponse.setUser(user);
       return  new ResponseEntity<>(profileResponse, HttpStatus.OK);
   }
   @GetMapping("/{id}")
   public ResponseEntity<ProfileResponse> getProfile(
           @PathVariable Long id
   ){
       Optional<User> user = Optional.ofNullable(userRepository.findById(id)
               .orElseThrow(() -> new RuntimeException("User không tồn tại")))
               ;
       ProfileResponse profileResponse = new ProfileResponse();
       profileResponse.setStatus(200);
       profileResponse.setUser(user.get());
       return  new ResponseEntity<>(profileResponse, HttpStatus.OK);
   }

   @PostMapping(value = "/update-avatar", consumes = "multipart/form-data")
    public  ResponseEntity<Response> updateAvatar(
           @RequestHeader("Authorization")  String jwt,
           @RequestPart("title") String title, // ✅ Dùng @RequestPart thay vì @RequestBody
           @RequestPart("avatar") MultipartFile avatar
           ) throws Exception {
       String path = fileStorageService.storeFile(avatar, "avatars");

       boolean check = userService.updateAvatar(jwt, path);
       Response response = new  Response();
       response.setMessage(check ? "Cập nhật thành công" : "Cập nhật không thành công");
       response.setStatus(200);
       return  new ResponseEntity<>(response, HttpStatus.OK);
   }

   @PostMapping(value = "/update-banner" , consumes = "multipart/form-data")
    public ResponseEntity<Response> updateBanner(
            @RequestHeader("Authorization") String jwt,
            @RequestPart("title") String title,
            @RequestPart("banner") MultipartFile banner

   ) throws Exception {
       String path = fileStorageService.storeFile(banner, "banners");
       boolean check = userService.updateBanner(jwt, path);
       Response response = new  Response();
       response.setMessage(check ? "Cập nhật thành công" : "Cập nhật không thành công");
       response.setStatus(200);
       return  new ResponseEntity<>(response, HttpStatus.OK);
   }

   @PostMapping("/update-description")
    public  ResponseEntity<Response> updateDescription(
           @RequestHeader("Authorization") String jwt,
           @RequestBody() DescriptionRequest description
   ) throws Exception {
       boolean check = userService.updateDescription(jwt,description.getDescription());
       Response response = new  Response();
       response.setMessage(check ? "Cập nhật thành công" : "Cập nhật không thành công");
       response.setStatus(200);
       return  new ResponseEntity<>(response, HttpStatus.OK);
   }



}
