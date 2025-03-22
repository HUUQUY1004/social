package com.social.Social.service;

import com.social.Social.model.User;

import java.util.List;

public interface SearchServiceImp {
    List<User> searchUserByName(String name);
}
