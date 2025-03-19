package com.social.Social.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.crypto.SecretKey;
import java.io.IOException;
import java.util.List;

public class JwtTokenValidator extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String requestURL = request.getRequestURI();
        System.out.println("Request URL: " + request.getRequestURI());
//        Bỏ các xt ko bắt đầu api
        if(!requestURL.startsWith("/api/"))
        {
            System.out.println("Permit all, no JWT validation required.");
            filterChain.doFilter(request, response);
            return;
        }
        String jwt = request.getHeader(JwtConstant.JWT_HEADER);

        if(jwt != null && jwt.startsWith("Bearer ")){
            jwt = jwt.substring(7);

            try{
                SecretKey key = Keys.hmacShaKeyFor(JwtConstant.SECRET_KEY.getBytes());
                Claims claims = Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(jwt).getBody();

                String email = String.valueOf(claims.get("email"));
                String authorities = String.valueOf(claims.get("authorities"));

                List<GrantedAuthority> authorityList = AuthorityUtils.commaSeparatedStringToAuthorityList(authorities);
                Authentication authentication = new UsernamePasswordAuthenticationToken(email, null, authorityList);

                SecurityContextHolder.getContext().setAuthentication(authentication);
                System.out.println("Token validated successfully");
            }
            catch (Exception e){
                System.out.println(" Invalid Token ");
                e.printStackTrace();
            }

        }else {
            System.out.println("No token provided");
        }
        filterChain.doFilter(request,response);

    }

}
