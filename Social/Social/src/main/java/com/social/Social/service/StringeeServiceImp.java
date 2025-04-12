package com.social.Social.service;

import com.social.Social.config.JwtConstant;
import com.social.Social.model.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
@Service
public class StringeeServiceImp implements  StringeeService{
    @Autowired
    private UserService userService;
    private SecretKey key = Keys.hmacShaKeyFor(JwtConstant.SECRET_KEY.getBytes());
    @Override
    public String getToken(String jwt) throws Exception {
        User user = userService.findUserByToken(jwt);
        String token = Jwts.builder().setIssuedAt(new Date()).
                setExpiration(
                        new Date(new Date().getTime() + 86400000)
                ).claim("userId", user.getId())
                .signWith(key)
                .compact();
        return token;
    }
}
