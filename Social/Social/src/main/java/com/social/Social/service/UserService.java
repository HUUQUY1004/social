package com.social.Social.service;

import com.social.Social.model.User;

public interface UserService {
    User findUserByToken(String jwt) throws  Exception;
    User findUserByEmail(String email) throws  Exception;

}
