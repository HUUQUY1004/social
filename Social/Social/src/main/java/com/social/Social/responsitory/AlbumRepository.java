package com.social.Social.responsitory;

import com.social.Social.model.Album;
import com.social.Social.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AlbumRepository extends JpaRepository<Album, Long> {
    @Query("select a from Album  a where  a.user = :user")
    List<Album> getAlbumForUser(User user);
}
