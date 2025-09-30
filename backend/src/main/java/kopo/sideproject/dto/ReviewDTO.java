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
        Long movieId, // 이 필드는 프론트엔드에서 TMDB ID로 사용됩니다.
        String title,
        String posterPath,
        Double rating,
        String content,
        String regDt

) {
    // Entity => DTO 변환을 위한 정적 팩토리 메소드
    public static ReviewDTO fromEntity(ReviewEntity entity) {

        String formattedDate = (entity.getRegDt() != null) ? entity.getRegDt().toLocalDate().toString() : null;

        return ReviewDTO.builder()
                .reviewId(entity.getReviewId())
                .userId(entity.getUser().getId())
                .email(entity.getUser().getEmail())
                .nickname(entity.getUser().getNickname())
                .movieId(entity.getMovie().getTmdbId())
                .title(entity.getMovie().getTitle())
                .posterPath(entity.getMovie().getPosterPath())
                .rating(entity.getRating())
                .content(entity.getContent())
                .regDt(formattedDate)
                .build();
    }
}
