package com.social.Social.config;

import com.social.Social.model.*;
import com.social.Social.responsitory.PostRepository;
import com.social.Social.responsitory.UserRepository;
import com.social.Social.responsitory.ImageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private ImageRepository imageRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            createDemoData();
        }
    }

    private void createDemoData() {
        System.out.println("Creating demo data...");        // Tạo users demo
        User admin = createUser("admin@social.com", "admin", "Admin User", Role.ADMIN, false);
        User user1 = createUser("nguyen.van.a@gmail.com", "nguyenvana", "Nguyễn Văn A", Role.USER, false);
        User user2 = createUser("tran.thi.b@gmail.com", "tranthib", "Trần Thị B", Role.USER, false);
        User user3 = createUser("le.minh.c@gmail.com", "leminhc", "Lê Minh C", Role.USER, false);
        User user4 = createUser("pham.thu.d@gmail.com", "phamthud", "Phạm Thu D", Role.USER, true); // blocked user
        User user5 = createUser("hoang.van.e@gmail.com", "hoangvane", "Hoàng Văn E", Role.USER, false);

        // Set admin as moderator for some posts
        User moderator = admin;        // Tạo posts demo với nhiều trạng thái khác nhau
        createDemoPost(user1, "Chuyến du lịch Đà Lạt tuyệt vời!", PostStatus.APPROVED, false, PostVisibility.PUBLIC, moderator, Arrays.asList(
            "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500",
            "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=501"
        ));

        createDemoPost(user2, "Món ăn ngon mới thử hôm nay", PostStatus.PENDING, false, PostVisibility.PUBLIC, null, Arrays.asList(
            "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500"
        ));

        createDemoPost(user3, "Hoàng hôn tuyệt đẹp trên biển", PostStatus.APPROVED, false, PostVisibility.PUBLIC, moderator, Arrays.asList(
            "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
            "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=501",
            "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=502"
        ));

        createDemoPost(user1, "Bài viết bị từ chối vì vi phạm quy định", PostStatus.REJECTED, false, PostVisibility.PUBLIC, moderator, Arrays.asList(
            "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=500"
        ));

        createDemoPost(user2, "Chia sẻ kinh nghiệm học lập trình", PostStatus.PENDING, false, PostVisibility.FRIENDS_ONLY, null, Arrays.asList(
            "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=500"
        ));

        createDemoPost(user5, "Thức uống healthy cho mùa hè", PostStatus.APPROVED, false, PostVisibility.PUBLIC, moderator, Arrays.asList(
            "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500"
        ));

        createDemoPost(user4, "Bài viết từ user bị block", PostStatus.PENDING, false, PostVisibility.PUBLIC, null, Arrays.asList(
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500"
        ));

        // Tạo reels demo
        createDemoPost(user1, "Reel múa hát vui nhộn", PostStatus.APPROVED, true, PostVisibility.PUBLIC, moderator, Arrays.asList(
            "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4"
        ));

        createDemoPost(user3, "Video nấu ăn step by step", PostStatus.PENDING, true, PostVisibility.PUBLIC, null, Arrays.asList(
            "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4"
        ));

        createDemoPost(user2, "Reel bị từ chối vì nội dung không phù hợp", PostStatus.REJECTED, true, PostVisibility.PUBLIC, moderator, Arrays.asList(
            "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4"
        ));

        createDemoPost(user1, "Tutorial makeup cơ bản", PostStatus.PENDING, true, PostVisibility.FRIENDS_ONLY, null, Arrays.asList(
            "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4"
        ));

        createDemoPost(user3, "Dance challenge trending", PostStatus.APPROVED, true, PostVisibility.PUBLIC, moderator, Arrays.asList(
            "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4"
        ));

        createDemoPost(user5, "Workout routine buổi sáng", PostStatus.PENDING, true, PostVisibility.PUBLIC, null, Arrays.asList(
            "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4"
        ));

        createDemoPost(user2, "Review sách hay", PostStatus.APPROVED, false, PostVisibility.PUBLIC, moderator, Arrays.asList(
            "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500"
        ));

        System.out.println("Demo data created successfully!");
    }    private User createUser(String email, String username, String fullName, Role role, boolean blocked) {
        User user = new User();
        user.setEmail(email);
        user.setUsername(username);
        user.setNickname(fullName); // Sử dụng nickname thay vì fullName
        user.setPassword(passwordEncoder.encode("123456")); // password mặc định
        user.setRole(role);
        user.setBlocked(blocked);
        user.setAvatar("https://ui-avatars.com/api/?name=" + fullName.replace(" ", "+") + "&background=random");
        
        return userRepository.save(user);
    }    private void createDemoPost(User user, String title, PostStatus status, boolean isReel, PostVisibility visibility, User moderatedBy, List<String> imageUrls) {
        Post post = new Post();
        post.setTitle(title);
        post.setUser(user);
        post.setStatus(status);
        post.setReel(isReel);
        post.setDelete(false);
        post.setPostVisibility(visibility);
        post.setComment(true);
        post.setShowLike(true);
        post.setScaleImage(1.0);
        
        // Set moderation info for rejected posts
        if (status == PostStatus.REJECTED) {
            post.setModerationReason(isReel ? "Nội dung không phù hợp với cộng đồng" : "Vi phạm quy định về nội dung");
            post.setModeratedAt(LocalDateTime.now().minusDays(1));
            post.setModeratedBy(moderatedBy);
        } else if (status == PostStatus.APPROVED) {
            post.setModeratedAt(LocalDateTime.now().minusHours(2));
            post.setModeratedBy(moderatedBy);
        }

        Post savedPost = postRepository.save(post);// Tạo images cho post
        for (int i = 0; i < imageUrls.size(); i++) {
            Image image = new Image();
            image.setImageUrl(imageUrls.get(i)); // Sử dụng setImageUrl thay vì setUrl
            image.setPost(savedPost);
            imageRepository.save(image);
        }
    }
}
