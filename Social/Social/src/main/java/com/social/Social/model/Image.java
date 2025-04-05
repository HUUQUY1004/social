package com.social.Social.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Image {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private  Long id;
    private String imageUrl;
    @ManyToOne
    @JoinColumn(name = "post_id")
    @JsonBackReference
    private Post post;
}
