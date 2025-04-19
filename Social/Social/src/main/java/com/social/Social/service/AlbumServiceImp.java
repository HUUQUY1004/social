package com.social.Social.service;

import com.social.Social.model.Album;
import com.social.Social.request.AddPostToAlbumRequest;
import com.social.Social.request.AlbumRequest;

import java.util.List;

public interface AlbumServiceImp {
    Album createAlbum(String jwt, AlbumRequest albumRequest) throws  Exception;

    List<Album> getAllAlbumForUser(String jwt) throws  Exception;

    boolean addPostToAlbum(String jwr, AddPostToAlbumRequest albumRequest) throws Exception;

    Album getAlbumById(Long id) throws  Exception;
    void deleteAlbum(String jwt, Long idAlbum) throws  Exception;
    void removePostFromAlbum(String jwt,Long albumId, Long postId) throws Exception;
}
