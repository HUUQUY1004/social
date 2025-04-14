package com.social.Social.service;

import com.social.Social.model.Album;
import com.social.Social.request.AlbumRequest;

import java.util.List;

public interface AlbumServiceImp {
    Album createAlbum(String jwt, AlbumRequest albumRequest) throws  Exception;

    List<Album> getAllAlbumForUser(String jwt) throws  Exception;
}
