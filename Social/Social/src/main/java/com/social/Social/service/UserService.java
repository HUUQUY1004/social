package com.social.Social.service;

import com.social.Social.model.User;
import com.social.Social.request.ChangePassword;

import java.util.List;

public interface UserService {
    User findUserByToken(String jwt) throws  Exception;
    User findUserByEmail(String email) throws  Exception;

    boolean updateAvatar(String jwt, String path) throws  Exception;

    boolean updateBanner(String jwt, String path) throws  Exception;

    boolean updateDescription(String jwt, String description) throws  Exception;

    List<User> getTenUser();

    User getUserById(Long userId) throws  Exception;

    void changePassword(ChangePassword changePassword) throws  Exception;
}
