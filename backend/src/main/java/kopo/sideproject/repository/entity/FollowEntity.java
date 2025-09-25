package kopo.sideproject.repository.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "follow",
uniqueConstraints = {
        @UniqueConstraint(
                name = "follow_uk",
                columnNames = {"follower_id", "following_id"}
        )
})
public class FollowEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "follow_id")
    private Long followId;

    // 팔로우를 하는 사용자 (follower)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "follower_id")
    private UserInfoEntity follower;

    // 팔로우를 받는 사용자 (following)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "following_id")
    private UserInfoEntity following;
}
