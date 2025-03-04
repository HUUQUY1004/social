package com.social.Social.service;

import com.social.Social.model.User;
import com.social.Social.responsitory.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImp  implements  UserService{
    @Autowired
    private UserRepository userRepository;
    @Override
    public User findUserByToken(String jwt) throws Exception {
        return null;
    }

    @Override
    public User findUserByEmail(String email) throws Exception {
        return null;
    }
}
