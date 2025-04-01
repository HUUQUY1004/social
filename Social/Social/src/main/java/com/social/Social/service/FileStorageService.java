package com.social.Social.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;
@Service
public class FileStorageService {
    private final  String UPLOAD ="uploads/";

    public String storeFile(MultipartFile file, String subDir) {
        try {
            String directory =  System.getProperty("user.dir") + File.separator + "uploads" + File.separator + subDir;
            Path dirPath = Paths.get(directory);

            if (!Files.exists(dirPath)) {
                Files.createDirectories(dirPath);
            }

            String changeName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path filePath = dirPath.resolve(changeName);

            file.transferTo(filePath.toFile());

            return Paths.get("/uploads", subDir, changeName).toString();

        } catch (IOException e) {
            throw new RuntimeException("Lỗi lưu file: " + e.getMessage(), e);
        }
    }
}
