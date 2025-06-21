package com.social.Social.responsitory;

import com.social.Social.model.Post;
import com.social.Social.model.Report;
import com.social.Social.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReportRepository extends JpaRepository<Report, Long> {

    // Lấy các báo cáo theo bài viết
    List<Report> findByPost(Post post);

    // Kiểm tra xem một user đã báo cáo bài viết chưa (để ngăn spam)
    boolean existsByPostAndReportedBy(Post post, User user);
}

