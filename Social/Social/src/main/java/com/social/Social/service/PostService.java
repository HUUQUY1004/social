package com.social.Social.service;

import com.social.Social.model.Post;

import java.util.List;

public interface PostService {
    int getNumberOfArticles(String jwt);
    Post createPost( Post post) throws Exception;
    List<Post> getPost(String jwt, Long userId) throws  Exception;
}
