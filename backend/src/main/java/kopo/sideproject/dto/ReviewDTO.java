package kopo.sideproject.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import kopo.sideproject.repository.entity.ReviewEntity;
import lombok.Builder;

@Builder
@JsonInclude(JsonInclude.Include.NON_DEFAULT)
public record ReviewDTO(
        Long reviewId,
        Long userId,
        String email,
        String nickname,
        Long movieId,
        String title,
        String posterPath,
        Double rating,
        String content

) {
    // Entity => DTO 변환을 위한 정적 팩토리 메소드
    public static ReviewDTO fromEntity(ReviewEntity entity) {
        return ReviewDTO.builder()
                .reviewId(entity.getReviewId())
                .userId(entity.getUser().getId())
                .email(entity.getUser().getEmail())
                .nickname(entity.getUser().getNickname())
                .movieId(entity.getMovie().getMovieId())
                .title(entity.getMovie().getMovieTitle())
                .posterPath(entity.getMovie().getPosterUrl())
                .rating(entity.getRating())
                .content(entity.getContent())
                .build();
    }
}
