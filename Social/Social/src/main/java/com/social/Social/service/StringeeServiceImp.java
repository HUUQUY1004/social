package com.social.Social.service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.social.Social.config.StringeeConfig;
import com.social.Social.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class StringeeServiceImp implements StringeeService {

    @Autowired
    private UserService userService;

    @Override
    public String getToken(String jwt) throws Exception {
        User user = userService.findUserByToken(jwt);
        System.out.println("userId "+ user.getId());
        return createAccessToken(
                StringeeConfig.SID_KEY,
                StringeeConfig.RESET_KEY,
                String.valueOf(user.getId())
        );
    }

//    public static String createAccessToken(String sid, String keySecret, String userId) throws Exception {
//        long expireTime = (System.currentTimeMillis() / 1000) + 86400;
//
//        String payload = "{\"jti\":\"" + sid + "-" + System.currentTimeMillis() + "\","
//                + "\"iss\":\"" + sid + "\","
//                + "\"exp\":" + expireTime + ","
//                + "\"userId\":\"" + userId + "\"}";
//
//        String header = Base64.getUrlEncoder().withoutPadding()
//                .encodeToString("{\"alg\":\"HS256\",\"typ\":\"JWT\"}".getBytes());
//
//        String base64Payload = Base64.getUrlEncoder().withoutPadding()
//                .encodeToString(payload.getBytes());
//
//        String signatureBase = header + "." + base64Payload;
//
//        Mac hmac = Mac.getInstance("HmacSHA256");
//        hmac.init(new SecretKeySpec(Base64.getDecoder().decode(keySecret), "HmacSHA256"));
//        byte[] signatureBytes = hmac.doFinal(signatureBase.getBytes());
//
//        String signature = Base64.getUrlEncoder().withoutPadding()
//                .encodeToString(signatureBytes);
//
//        return signatureBase + "." + signature;
//    }
public static String createAccessToken(String sid, String base64Key, String userId) throws Exception {
    long currentTime = System.currentTimeMillis();
    long expireTime = (currentTime / 1000) + 86400;

    Algorithm algorithmHS = Algorithm.HMAC256(base64Key);

    Map<String, Object> headerClaims = new HashMap<>();
    headerClaims.put("typ", "JWT");
    headerClaims.put("alg", "HS256");
    headerClaims.put("cty", "stringee-api;v=1");

    String token = JWT.create().withHeader(headerClaims)
            .withClaim("jti", sid + "-" + currentTime)
            .withClaim("iss", sid)
            .withClaim("userId", userId)
            .withExpiresAt(new Date(expireTime * 1000)) // convert to milliseconds
            .sign(algorithmHS);

    return token;
}

}
