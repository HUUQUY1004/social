package com.social.Social.service;

import com.social.Social.config.StringeeConfig;
import com.social.Social.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

@Service
public class StringeeServiceImp implements StringeeService {

    @Autowired
    private UserService userService;

    @Override
    public String getToken(String jwt) throws Exception {
        User user = userService.findUserByToken(jwt);
        return createAccessToken(
                StringeeConfig.SID_KEY,
                StringeeConfig.RESET_KEY,
                String.valueOf(user.getId())
        );
    }

    public static String createAccessToken(String sid, String keySecret, String userId) throws Exception {
        long expireTime = (System.currentTimeMillis() / 1000) + 86400;

        String payload = "{\"jti\":\"" + sid + "-" + System.currentTimeMillis() + "\","
                + "\"iss\":\"" + sid + "\","
                + "\"exp\":" + expireTime + ","
                + "\"userId\":\"" + userId + "\"}";

        String header = Base64.getUrlEncoder().withoutPadding()
                .encodeToString("{\"alg\":\"HS256\",\"typ\":\"JWT\"}".getBytes());

        String base64Payload = Base64.getUrlEncoder().withoutPadding()
                .encodeToString(payload.getBytes());

        String signatureBase = header + "." + base64Payload;

        Mac hmac = Mac.getInstance("HmacSHA256");
        hmac.init(new SecretKeySpec(Base64.getDecoder().decode(keySecret), "HmacSHA256"));
        byte[] signatureBytes = hmac.doFinal(signatureBase.getBytes());

        String signature = Base64.getUrlEncoder().withoutPadding()
                .encodeToString(signatureBytes);

        return signatureBase + "." + signature;
    }
}
