package com.social.Social.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
public class ActivityHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Enumerated(EnumType.STRING)
    private EnumActivity activityType;

    private String content;

    @Column
    @Builder.Default
    private  boolean isDelete = false;

    private String link;

    private LocalDateTime timestamp;

    @PrePersist
    protected  void  onCreated(){
        this.timestamp = LocalDateTime.now();
    }
}
