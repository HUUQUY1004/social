package com.social.Social.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShareRequest {

    Long postId;
    List<Long> selectedFriends;
    String content;
}
