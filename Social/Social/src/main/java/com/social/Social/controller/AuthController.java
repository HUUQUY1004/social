package com.social.Social.controller;

import com.social.Social.model.User;
import com.social.Social.request.LoginRequest;
import com.social.Social.response.AuthResponse;
import com.social.Social.responsitory.UserRepository;
import com.social.Social.service.CustomerUserDetailsService;
import com.social.Social.config.JwtProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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


    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register (@RequestBody User userReq) throws Exception {
        System.out.println("usser Request");
//        check user
        User userWithEmail =  userRepository.findByEmail(userReq.getEmail());
        if(userWithEmail !=null) {
            throw  new Exception("Email đã tồn tại ở tài khoản khác");
        }
        User newUser = new User();
        newUser.setEmail(userReq.getEmail());
        newUser.setNickname(userReq.getNickname());
        newUser.setPassword(passwordEncoder.encode(userReq.getPassword()));

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
    public ResponseEntity<AuthResponse> login (@RequestBody LoginRequest loginRequest) {
        System.out.println("run");
        Authentication authentication = authenticate(loginRequest.getEmail(), loginRequest.getPassword());
        String jwt = jwtProvider.generateToken(authentication);
        AuthResponse authResponse = new AuthResponse();
        authResponse.setJwt(jwt);
        authResponse.setMessage("Login success");
        return  new ResponseEntity<>(authResponse, HttpStatus.OK);
    }
    private Authentication authenticate(String email, String password) {
        UserDetails userDetails = customerUserDetailsService.loadUserByUsername(email);
        System.out.println("user detail:" + userDetails.getPassword());
        if(userDetails == null) {
            throw  new BadCredentialsException("Invalid email...");
        }
        System.out.println("match"+ passwordEncoder.matches(password,userDetails.getPassword()));
        if(!passwordEncoder.matches(password,userDetails.getPassword())){
            throw  new BadCredentialsException("Invalid password");
        }
        return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
    }
}
