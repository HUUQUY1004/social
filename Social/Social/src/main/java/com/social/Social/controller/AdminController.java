package com.social.Social.controller;

import com.social.Social.model.Post;
import com.social.Social.model.PostStatus;
import com.social.Social.model.Role;
import com.social.Social.model.User;
import com.social.Social.response.Response;
import com.social.Social.service.PostService;
import com.social.Social.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {    
    @Autowired
    private UserService userService;
    
    @Autowired
    private PostService postService;

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() throws Exception {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<User> getUserById(@PathVariable Long userId) throws Exception {
        User user = userService.findUserById(userId);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/users/{userId}/role")
    public ResponseEntity<Response> updateUserRole(@PathVariable Long userId, @RequestParam Role role) throws Exception {
        User user = userService.findUserById(userId);
        user.setRole(role);
        userService.updateUser(user);
        
        Response response = new Response();
        response.setMessage("Cập nhật quyền người dùng thành công");
        response.setStatus(200);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<Response> deleteUser(@PathVariable Long userId) throws Exception {
        userService.deleteUser(userId);
        
        Response response = new Response();
        response.setMessage("Xóa người dùng thành công");
        response.setStatus(200);
        return ResponseEntity.ok(response);
    }    @GetMapping("/dashboard")
    public ResponseEntity<Response> getAdminDashboard() {
        Response response = new Response();
        response.setMessage("Chào mừng đến trang quản trị");
        response.setStatus(200);
        return ResponseEntity.ok(response);
    }    @GetMapping("/dashboard/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() throws Exception {
        Map<String, Object> stats = new HashMap<>();
        
        List<User> allUsers = userService.getAllUsers();
        List<Post> allPosts = postService.getAllPosts();
        List<Post> allReels = postService.getAllReels();
        List<Post> pendingPosts = postService.getPostsByStatus(PostStatus.PENDING);
        List<Post> pendingReels = postService.getReelsByStatus(PostStatus.PENDING);
        
        stats.put("totalUsers", allUsers.size());
        stats.put("activeUsers", allUsers.stream().filter(u -> !u.isBlocked()).count());
        stats.put("totalPosts", allPosts.size());
        stats.put("totalReels", allReels.size());
        stats.put("pendingPosts", pendingPosts.size());
        stats.put("pendingReels", pendingReels.size());
        
        return ResponseEntity.ok(stats);
    }

    @PostMapping("/users/{userId}/block")
    public ResponseEntity<Response> blockUser(@PathVariable Long userId) throws Exception {
        User user = userService.findUserById(userId);
        user.setBlocked(true);
        userService.updateUser(user);
        
        Response response = new Response();
        response.setMessage("Đã khóa người dùng thành công");
        response.setStatus(200);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/users/{userId}/unblock")
    public ResponseEntity<Response> unblockUser(@PathVariable Long userId) throws Exception {
        User user = userService.findUserById(userId);
        user.setBlocked(false);
        userService.updateUser(user);
        
        Response response = new Response();
        response.setMessage("Đã mở khóa người dùng thành công");
        response.setStatus(200);
        return ResponseEntity.ok(response);
    }    @GetMapping("/posts/pending")
    public ResponseEntity<List<Post>> getPendingPosts() throws Exception {
        List<Post> pendingPosts = postService.getPostsByStatus(PostStatus.PENDING);
        return ResponseEntity.ok(pendingPosts);
    }
    
    @GetMapping("/posts/all")
    public ResponseEntity<List<Post>> getAllPosts() throws Exception {
        List<Post> allPosts = postService.getAllPosts();
        return ResponseEntity.ok(allPosts);
    }

    @PostMapping("/posts/{postId}/approve")
    public ResponseEntity<Response> approvePost(@PathVariable Long postId, @RequestHeader("Authorization") String jwt) throws Exception {
        postService.moderatePost(jwt, postId, PostStatus.APPROVED, null);
        
        Response response = new Response();
        response.setMessage("Đã duyệt bài viết thành công");
        response.setStatus(200);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/posts/{postId}/reject")
    public ResponseEntity<Response> rejectPost(@PathVariable Long postId, @RequestBody Map<String, String> request, @RequestHeader("Authorization") String jwt) throws Exception {
        String reason = request.get("reason");
        postService.moderatePost(jwt, postId, PostStatus.REJECTED, reason);
        
        Response response = new Response();
        response.setMessage("Đã từ chối bài viết thành công");
        response.setStatus(200);
        return ResponseEntity.ok(response);
    }    @GetMapping("/reels/pending")
    public ResponseEntity<List<Post>> getPendingReels() throws Exception {
        List<Post> pendingReels = postService.getReelsByStatus(PostStatus.PENDING);
        return ResponseEntity.ok(pendingReels);
    }

    @GetMapping("/reels/all")
    public ResponseEntity<List<Post>> getAllReels() throws Exception {
        List<Post> allReels = postService.getAllReels();
        return ResponseEntity.ok(allReels);
    }

    @PostMapping("/reels/{reelId}/approve")
    public ResponseEntity<Response> approveReel(@PathVariable Long reelId, @RequestHeader("Authorization") String jwt) throws Exception {
        postService.moderateReel(jwt, reelId, PostStatus.APPROVED, null);
        
        Response response = new Response();
        response.setMessage("Đã duyệt reel thành công");
        response.setStatus(200);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/reels/{reelId}/reject")
    public ResponseEntity<Response> rejectReel(@PathVariable Long reelId, @RequestBody Map<String, String> request, @RequestHeader("Authorization") String jwt) throws Exception {
        String reason = request.get("reason");
        postService.moderateReel(jwt, reelId, PostStatus.REJECTED, reason);
        
        Response response = new Response();
        response.setMessage("Đã từ chối reel thành công");
        response.setStatus(200);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/posts/{postId}")
    public ResponseEntity<Response> deletePost(@PathVariable Long postId, @RequestHeader("Authorization") String jwt) throws Exception {
        postService.deleteAndBackupPost(postId);
        
        Response response = new Response();
        response.setMessage("Đã xóa bài viết thành công");
        response.setStatus(200);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/reels/{reelId}")
    public ResponseEntity<Response> deleteReel(@PathVariable Long reelId, @RequestHeader("Authorization") String jwt) throws Exception {
        postService.deleteAndBackupPost(reelId);
        
        Response response = new Response();
        response.setMessage("Đã xóa reel thành công");
        response.setStatus(200);
        return ResponseEntity.ok(response);
    }
}
