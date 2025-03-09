package com.social.Social.service;

import com.social.Social.model.User;
import com.social.Social.responsitory.UserRepository;
import com.social.Social.config.JwtProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImp  implements  UserService{
    @Autowired
    private UserRepository userRepository;
    private JwtProvider jwtProvider;
    @Override
    public User findUserByToken(String jwt) throws Exception {
        return findUserByEmail( jwtProvider.getEmailFromJwtToken(jwt));
    }

    @Override
    public User findUserByEmail(String email) throws Exception {
        return null;
    }
}
