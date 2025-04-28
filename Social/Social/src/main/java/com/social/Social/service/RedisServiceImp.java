package com.social.Social.service;

public interface RedisServiceImp {
    void saveData(String key, Object value);
    void getData(String key);
    void deleteData(String key);
}
