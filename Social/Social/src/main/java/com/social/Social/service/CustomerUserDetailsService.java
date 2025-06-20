package com.social.Social.service;

import com.social.Social.model.User;
import com.social.Social.responsitory.UserRepository;
import com.social.Social.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CustomerUserDetailsService implements UserDetailsService {
    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(username);
        if(user == null){
            throw  new UsernameNotFoundException("User not found with email " + username);

        }
        UserDetailsImpl userDetails = new UserDetailsImpl();
        userDetails.setId(user.getId()); // Đây là điều quan trọng - set ID
        userDetails.setUsername(user.getEmail());
        userDetails.setPassword(user.getPassword());
        List<GrantedAuthority> authorities = new ArrayList<>();
        userDetails.setAuthorities(authorities);
//        return  new org.springframework.security.core.userdetails.User(user.getEmail(), user.getPassword(), new ArrayList<>());
        return  userDetails;
    }
}
