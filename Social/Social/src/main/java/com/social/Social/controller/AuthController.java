package com.social.Social.controller;

import com.social.Social.model.ActivityHistory;
import com.social.Social.model.EnumActivity;
import com.social.Social.model.User;
import com.social.Social.request.ChangePassword;
import com.social.Social.request.FindUserByEmailRequest;
import com.social.Social.request.LoginRequest;
import com.social.Social.request.VerifyOTPRequest;
import com.social.Social.response.AuthResponse;
import com.social.Social.response.Response;
import com.social.Social.responsitory.UserRepository;
import com.social.Social.service.*;
import com.social.Social.config.JwtProvider;
import com.social.Social.service.implemenent.InforDeviceImplement;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtProvider jwtProvider;

    @Autowired
    private CustomerUserDetailsService customerUserDetailsService;

    @Autowired
    private UserService userService;

    @Autowired
    private SendMailService sendMailService;

    @Autowired
    private OTPService otpService;
    @Autowired
    private ActivityHistoryService activityHistoryService;

    @Autowired
    private InforDeviceImplement inforDeviceImplement;

    @PostMapping("/find-email")
    public ResponseEntity<Response> findUserByEmail(@RequestBody FindUserByEmailRequest findUserByEmailRequest) throws Exception {
        Response response = new Response();
        System.out.println(findUserByEmailRequest.getEmail());
        User user = userService.findUserByEmail(findUserByEmailRequest.getEmail());
        System.out.println("User with email " + user.toString());
        if(user != null){
            sendMailService.sendEmail(user.getEmail(), "Mã để reset mật khẩu",
                   "Mã xác thực của bạn là: " + otpService.generateOTP(user.getEmail()
                    ));
            response.setMessage("OK");
            response.setStatus(200);
        }
        else {
            response.setMessage("User not found");
            response.setStatus(404);
        }
        return  ResponseEntity.ok(response);
    }
    @PostMapping("/verify-otp")
    public  ResponseEntity<Response> verifyOTP(@RequestBody VerifyOTPRequest verifyOTPRequest){
        System.out.println(verifyOTPRequest.toString());
        Response response = new Response();
        boolean check = otpService.verifyOTP(verifyOTPRequest.getEmail(), verifyOTPRequest.getOtp());
        System.out.println("check: " + check);
        if(check == true){
            response.setStatus(200);
            response.setMessage("Verify Success");
        }
        else {
            response.setStatus(400);
            response.setMessage("Verify Success");
        }
        return  ResponseEntity.ok(response);
    }
    @PostMapping("change-password")
    public  ResponseEntity<Response> changePassword(@RequestBody ChangePassword changePassword) throws Exception {
        System.out.println(changePassword.toString());
        Response response = new Response();
        if(!changePassword.getPassword().equals(changePassword.getConfirmPassword())){
            response.setStatus(404);
            response.setMessage("No match");
        }
        else {
            userService.changePassword(changePassword);
            response.setStatus(200);
            response.setMessage("Success");
        }
        return  ResponseEntity.ok(response);
    }
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register (@RequestBody User userReq) throws Exception {
        System.out.println("user Request" + userReq.toString());
//        check user
        User userWithEmail =  userRepository.findByEmail(userReq.getEmail());
        if(userWithEmail !=null) {
            throw  new Exception("Email đã tồn tại ở tài khoản khác");
        }
        User newUser = new User();
        newUser.setEmail(userReq.getEmail());
        newUser.setNickname(userReq.getNickname());
        newUser.setPassword(passwordEncoder.encode(userReq.getPassword()));
        newUser.setUsername(userReq.getUsername());
        newUser.setStringeeId(UUID.randomUUID().toString());

        User savedUser = userRepository.save(newUser);

        Authentication authentication = new UsernamePasswordAuthenticationToken(
                savedUser.getEmail(), savedUser.getPassword()
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = jwtProvider.generateToken(authentication);
        AuthResponse authResponse = new AuthResponse();
        authResponse.setJwt(jwt);
        authResponse.setMessage("Register success");
        return new ResponseEntity<>(authResponse, HttpStatus.CREATED);
    }
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login (@RequestBody LoginRequest loginRequest, HttpServletRequest request ) {
        AuthResponse authResponse = new AuthResponse();
       try{
           Authentication authentication = authenticate(loginRequest.getEmail(), loginRequest.getPassword());
           String jwt = jwtProvider.generateToken(authentication);
//           AuthResponse authResponse = new AuthResponse();
           authResponse.setJwt(jwt);
           authResponse.setMessage("Login success");


//           Xác định
           String device = inforDeviceImplement.getDeviceInfo(request);

           String location = inforDeviceImplement.getLocationInfo(request);

           ActivityHistory activityHistory = new ActivityHistory().builder()
                   .isDelete(false).
                   content("Bạn đã đăng nhập vào tại thiết bị " + device +" tại : "+ location).activityType(EnumActivity.LOGIN).
                   build();
           activityHistoryService.createActivityHistory(activityHistory);
           return  new ResponseEntity<>(authResponse, HttpStatus.OK);
       }
       catch (UsernameNotFoundException e) {

           authResponse.setMessage("Email không tồn tại");
           return new ResponseEntity<>(authResponse, HttpStatus.BAD_REQUEST);
       } catch (BadCredentialsException e) {
           authResponse.setMessage(e.getMessage());
           return new ResponseEntity<>(authResponse, HttpStatus.BAD_REQUEST);
       } catch (Exception e) {
           throw new RuntimeException(e);
       }


    }
    private Authentication authenticate(String email, String password) {
        UserDetails userDetails = customerUserDetailsService.loadUserByUsername(email);
        if(userDetails == null) {
            throw  new BadCredentialsException("Invalid email...");
        }

        if(!passwordEncoder.matches(password,userDetails.getPassword())){
            throw  new BadCredentialsException("Vui lòng kiểm tra lại mật khẩu");
        }
        return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
    }
}
