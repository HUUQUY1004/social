package com.social.Social.service;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

public class FileStorageService {
    private final  String UPLOAD ="uploads/";

    public  String storeFile(MultipartFile file , String subDir) {
        try{
            String directory = UPLOAD + subDir;
            Files.createDirectory(Paths.get(directory));

//            String name
            String changeName = UUID.randomUUID() + "_"+ file.getOriginalFilename();
            Path filePath = Paths.get(directory , changeName);
            file.transferTo(filePath.toFile());

            return  "/" + directory + changeName;
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
