package com.social.Social.request;

import com.social.Social.model.PostVisibility;
import lombok.Data;

@Data
public class ChangePermitRequest {
    private Long postId;
    private PostVisibility postVisibility;
}
