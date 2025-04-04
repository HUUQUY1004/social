package com.social.Social.service;

import com.social.Social.model.Post;

public interface PostService {
    int getNumberOfArticles(String jwt);
    Post createPost( Post post) throws Exception;
}
