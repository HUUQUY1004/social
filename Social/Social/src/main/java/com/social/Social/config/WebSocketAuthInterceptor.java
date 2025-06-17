package com.social.Social.config;

import com.social.Social.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class WebSocketAuthInterceptor implements ChannelInterceptor {

    @Autowired
    private JwtProvider jwtProvider;

    @Autowired
    private UserService userService;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);
          if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            String authHeader = accessor.getFirstNativeHeader("Authorization");
            System.out.println("WebSocket Auth Header: " + authHeader);
            
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String jwt = authHeader.substring(7);
                System.out.println("Extracted JWT: " + jwt.substring(0, Math.min(jwt.length(), 50)) + "...");                try {
                    // TEMPORARY: Skip JWT validation for testing
                    // String email = jwtProvider.getEmailFromJwtToken(jwt);
                    // System.out.println("JWT Email: " + email);
                    
                    // For testing: use a dummy email to find user  
                    String testEmail = "nguyen.van.a@gmail.com"; // Change this to actual user email
                    var user = userService.findUserByEmail(testEmail);
                    System.out.println("Testing with user: " + user.getEmail());
                    
                    // Store JWT in session attributes for later use
                    accessor.getSessionAttributes().put("jwt", jwt);
                    accessor.getSessionAttributes().put("user", user);
                      // Set authentication context
                    UsernamePasswordAuthenticationToken authentication = 
                        new UsernamePasswordAuthenticationToken(user, null, null);
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    accessor.setUser(authentication);
                    
                    System.out.println("WebSocket authentication successful for user: " + testEmail);
                } catch (Exception e) {
                    System.err.println("WebSocket JWT authentication failed: " + e.getMessage());
                    e.printStackTrace();
                }
            } else {
                System.out.println("No valid Authorization header found");
            }
        }
        
        return message;
    }
}
