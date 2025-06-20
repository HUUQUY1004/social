package com.social.Social.service.implemenent;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.social.Social.model.FacebookUser;
import com.social.Social.service.interfaces.IFacebookService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
@Service
public class FacebookService implements IFacebookService {
    @Value("${facebook.appId}")
    private String clientId;

    @Value("${facebook.secretKey}")
    private String clientSecret;

    @Value("${facebook.redirect-uri}")
    private String redirectUri;
    @Override
    public String getAccessToken(String code) {
        String url = "https://graph.facebook.com/v17.0/oauth/access_token"
                + "?client_id=" + clientId
                + "&redirect_uri=" + URLEncoder.encode(redirectUri, StandardCharsets.UTF_8)
                + "&client_secret=" + clientSecret
                + "&code=" + code;
        RestTemplate restTemplate = new RestTemplate();
        String result = restTemplate.getForObject(url, String.class);

        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode node = mapper.readTree(result);
            return node.get("access_token").asText();
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi lấy access token từ Facebook", e);
        }
    }

    @Override
    public FacebookUser getEmailFromToken(String accessToken) {
        String url = "https://graph.facebook.com/me?fields=id,name,email,picture&access_token=" + accessToken;
        RestTemplate restTemplate = new RestTemplate();
        return restTemplate.getForObject(url, FacebookUser.class);
    }
}
