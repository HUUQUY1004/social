package com.social.Social.service;

import com.social.Social.model.Post;
import com.social.Social.model.User;
import com.social.Social.responsitory.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PostServiceImp implements  PostService{
    @Autowired
    UserService userService;
    @Autowired
    PostRepository postRepository;


    @Override
    public int getNumberOfArticles(String jwt) {
        return 0;
    }

    @Override
    public Post createPost( Post post) throws Exception {
        return  postRepository.save(post);
    }
}
