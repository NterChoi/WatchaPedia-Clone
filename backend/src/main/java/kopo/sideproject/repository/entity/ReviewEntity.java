package kopo.sideproject.repository.entity;

import jakarta.persistence.*;
import kopo.sideproject.dto.ReviewRequestDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "REVIEWS")
@DynamicInsert
@DynamicUpdate
public class ReviewEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reviewId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private UserInfoEntity user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "movie_id", nullable = false)
    private MovieEntity movie;

    @Column(name = "rating", nullable = false)
    private Double rating;

    @Column(name = "content", length = 5000)
    private String content;

    @Column(name = "reg_dt", updatable = false)
    private String regDt;

    public void updateReview(Double rating, String content) {
        this.rating = rating;
        this.content = content;
    }
}
