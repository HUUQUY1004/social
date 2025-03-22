package com.social.Social.service;

import com.social.Social.model.User;
import com.social.Social.responsitory.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class SearchService implements SearchServiceImp{

    @Autowired
    private UserRepository userRepository;
    @Override
    public List<User> searchUserByName(String name) {
        return userRepository.searchUserByNickname(name);
    }
}
