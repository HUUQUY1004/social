package com.social.Social.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Report {

    @jakarta.persistence.Id
    @Id
    @GeneratedValue
    private Long id;

    private String reason;

    private LocalDateTime reportedAt;

    @ManyToOne
    private Post post;

    @ManyToOne
    private User reportedBy;
}
