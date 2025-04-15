package com.social.Social.service;

import com.social.Social.model.Album;
import com.social.Social.model.Post;
import com.social.Social.model.User;
import com.social.Social.request.AddPostToAlbumRequest;
import com.social.Social.request.AlbumRequest;
import com.social.Social.responsitory.AlbumRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AlbumService implements  AlbumServiceImp{
    @Autowired
    UserService userService;
    @Autowired
    AlbumRepository albumRepository;

    @Autowired
    PostService postService;
    @Override
    public Album createAlbum(String jwt, AlbumRequest albumRequest) throws Exception {
        User user = userService.findUserByToken(jwt);
        Album album = new Album();
        album.setName(albumRequest.getName());
        album.setUser(user);
        return  albumRepository.save(album);
    }

    @Override
    public List<Album> getAllAlbumForUser(String jwt) throws Exception {
        User user = userService.findUserByToken(jwt);
        List<Album> albums = albumRepository.getAlbumForUser(user);
        return  albums;
    }

    @Override
    public boolean addPostToAlbum(String jwt, AddPostToAlbumRequest albumRequest) throws Exception {
        User user = userService.findUserByToken(jwt);
        Post post = postService.getPostById(albumRequest.getPostId());

        List<Album> albums = albumRepository.findAllById(albumRequest.getSelectedAlbum());

        for (Album album : albums) {
            if (!album.getPosts().contains(post)) {
                album.getPosts().add(post);
            }
        }

        albumRepository.saveAll(albums);
        return true;
    }
}
