package com.social.Social.request;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
@Data
@NoArgsConstructor
public class AddPostToAlbumRequest {
    private  Long postId;
    List<Long> selectedAlbum;
}
