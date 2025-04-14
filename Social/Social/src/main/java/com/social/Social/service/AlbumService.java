package com.social.Social.service;

import com.social.Social.model.Album;
import com.social.Social.model.User;
import com.social.Social.request.AlbumRequest;
import com.social.Social.responsitory.AlbumRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AlbumService implements  AlbumServiceImp{
    @Autowired
    UserService userService;
    @Autowired
    AlbumRepository albumRepository;
    @Override
    public Album createAlbum(String jwt, AlbumRequest albumRequest) throws Exception {
        User user = userService.findUserByToken(jwt);
        Album album = new Album();
        album.setName(album.getName());
        album.setUser(user);
        return  albumRepository.save(album);
    }
}
