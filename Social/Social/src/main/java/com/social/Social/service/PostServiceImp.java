package com.social.Social.service;

import com.social.Social.model.Post;
import com.social.Social.model.User;
import com.social.Social.responsitory.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

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

    @Override
    public List<Post> getPost(String jwt, Long userId) throws Exception {
        User user = userService.findUserByToken(jwt);
        List<Post> posts =  postRepository.getVisiblePostsWithImages(user.getId(), userId);
        return  posts;
    }

    @Override
    public Post getPostById(Long id) throws Exception {
        return  postRepository.findById(id).orElseThrow(()->new Exception("Post not found with id " + id));
    }
}
