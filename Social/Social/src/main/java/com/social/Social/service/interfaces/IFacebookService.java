package com.social.Social.service.interfaces;

import com.social.Social.model.FacebookUser;
import com.social.Social.model.User;

public interface IFacebookService {
    String getAccessToken(String jwt);
    FacebookUser getEmailFromToken(String accessToken);
}
