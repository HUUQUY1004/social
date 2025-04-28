package com.social.Social.service;

import com.social.Social.model.Post;
import com.social.Social.request.CommentPost;

import java.util.List;

public interface PostService {
    int getNumberOfArticles(String jwt);
    Post createPost( Post post) throws Exception;
    List<Post> getPost(String jwt, Long userId) throws  Exception;
    Post getPostById(Long id) throws  Exception;

    boolean likePost(String jwt, Long postId) throws  Exception;

    boolean commentPost(String jwt, CommentPost commentPost) throws Exception;

    boolean deleteAndBackupPost(Long postId) throws  Exception;
    int  getQuantityPost(String jwt) throws  Exception;
    List<Post> getPostHome(String jwt) throws Exception;
    List<Post> getTrash(String jwt) throws  Exception;

    List<Post> getReel() throws  Exception;
}
