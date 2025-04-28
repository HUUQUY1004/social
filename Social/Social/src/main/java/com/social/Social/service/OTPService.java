package com.social.Social.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Random;
@Service
public class OTPService  implements  OTPServiceImp{
    @Autowired
    private RedisService redisService;
    @Override
    public String generateOTP(String email) {
        String otp = String.format("%06d", new Random().nextInt(1000000));
        redisService.saveData(email, otp);
        return otp;
    }

    @Override
    public boolean verifyOTP(String email, String input) {
        Object o = redisService.getData(email);
        if (o == null || !o.toString().equals(o)) {
            return  false;
        }
        redisService.deleteData(email);
        return true;
    }
}
