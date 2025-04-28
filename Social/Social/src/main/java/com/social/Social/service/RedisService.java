package com.social.Social.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
public class RedisService implements  RedisServiceImp{
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    @Override
    public void saveData(String key, Object value) {
        redisTemplate.opsForValue().set(key, value,5, TimeUnit.MINUTES);
    }

    @Override
    public Object getData(String key) {
        return redisTemplate.opsForValue().get(key);
    }

    @Override
    public void deleteData(String key) {
        redisTemplate.delete(key);

    }
}
