package com.social.Social.service;

import com.social.Social.model.User;
import com.social.Social.responsitory.UserRepository;
import com.social.Social.config.JwtProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImp  implements  UserService{
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private JwtProvider jwtProvider;
    @Override
    public User findUserByToken(String jwt) throws Exception {
        return findUserByEmail( jwtProvider.getEmailFromJwtToken(jwt));
    }

    @Override
    public User findUserByEmail(String email) throws Exception {
        User user = userRepository.findByEmail(email);

        if(user == null) {
            throw  new Exception("User not found");
        }

        return user;
    }

    @Override
    public boolean updateAvatar(String jwt, String path) throws Exception {
        User user = findUserByToken(jwt);
        int check = userRepository.updateAvatar(user.getId(),path );
        return check >0;
    }

    @Override
    public boolean updateBanner(String jwt, String path) throws Exception {
        User user = findUserByToken(jwt);
        int check = userRepository.updateBanner(user.getId(), path);
        return check >0;
    }

    @Override
    public boolean updateDescription(String jwt, String description) throws Exception {
        User user = findUserByToken(jwt);
        int check = userRepository.updateDescription(user.getId(), description);

        
        return  check >0;
    }

    @Override
    public List<User> getTenUser() {
        Pageable pageable =  PageRequest.of(0,10);
        return  userRepository.getTenUser(pageable);
    }
}
