package com.social.Social.service;

import com.social.Social.model.Comment;
import com.social.Social.model.Post;
import com.social.Social.model.User;
import com.social.Social.request.CommentPost;
import com.social.Social.responsitory.CommentRepository;
import com.social.Social.responsitory.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
public class PostServiceImp implements  PostService{
    @Autowired
    UserService userService;
    @Autowired
    PostRepository postRepository;

    @Autowired
    CommentRepository commentRepository;

    @Autowired
    NotifyService notifyService;
    @Override
    public int getNumberOfArticles(String jwt) {
        return 0;
    }

    @Override
    public Post createPost( String jwt,Post post) throws Exception {
        Post newPost = postRepository.save(post);
//        Send Notify to Friend
        notifyService.postNotify(jwt, newPost.getId());

        return  newPost;
    }

    @Override
    public List<Post> getPost(String jwt, Long userId) throws Exception {
        User user = userService.findUserByToken(jwt);
        List<Post> posts =  postRepository.getVisiblePostsWithImages(userId,user.getId() );
        return  posts;
    }

    @Override
    public Post getPostById(Long id) throws Exception {
        return  postRepository.findById(id).orElseThrow(()->new Exception("Post not found with id " + id));
    }

    @Override
    public boolean likePost(String jwt, Long postId) throws Exception {
        User user = userService.findUserByToken(jwt);
        if(user == null){
            throw  new Exception("User nott found");
        }

        Post post = postRepository.findById(postId).orElseThrow(()-> new Exception("Pots not found"));

        Set<User> likedUsers = post.getLikedByUsers();
        boolean isLiked = likedUsers.contains(user);
        boolean b = isLiked ? likedUsers.remove(user) : likedUsers.add(user);
        post.setLikedByUsers(likedUsers);
        postRepository.save(post);
        return  b;
    }

    @Override
    public boolean commentPost(String jwt, CommentPost commentPost) throws Exception {
        User user = userService.findUserByToken(jwt);

        Post post = postRepository.findById(commentPost.getPostId()).orElseThrow(()-> new Exception("Post not found"));

        Comment comment = new Comment();
        comment.setPost(post);
        comment.setUser(user);
        comment.setContent(commentPost.getComment());
        commentRepository.save(comment);
        return  true;

    }

    @Override
    public boolean deleteAndBackupPost(Long postId) throws Exception {
        Post post = postRepository.findById(postId).orElseThrow(()-> new Exception("Post not found"));

        post.setDelete(!post.isDelete());
        Post newPost =   postRepository.save(post);
        if(newPost !=null){
            return  true;
        }
        return  false;
    }

    @Override
    public int getQuantityPost(String jwt) throws Exception {
        User user = userService.findUserByToken(jwt);
        int quantity = postRepository.getQuantityPost(user);
        System.out.println("quantity post" + quantity);
        return quantity;
    }

    @Override
    @Cacheable(value = "postsHome",unless = "#result == null || #result.isEmpty()")
    public List<Post> getPostHome(String jwt) throws Exception {
        User user = userService.findUserByToken(jwt);
        return  postRepository.getPostHome(user.getId());
    }

    @Override
    @Cacheable(value = "trashs",unless = "#result == null || #result.isEmpty()")
    public List<Post> getTrash(String jwt) throws Exception {
        User user = userService.findUserByToken(jwt);
        List<Post> posts = postRepository.getTrash(user);
        return  posts;
    }

    @Override
    @Cacheable(value = "reels",unless = "#result == null || #result.isEmpty()")
    public List<Post> getReel() throws Exception {
        System.out.println("Truy vấn DB lấy reels");
        return postRepository.getReel();
    }
}
