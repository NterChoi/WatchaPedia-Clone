package kopo.sideproject.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;

@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public record FollowDTO(
        // 팔로워 / 팔로잉 목록에서 사용자 정보를 나타낼 때 사용
        Long userId,
        String email,
        String nickname,
        String profileImg,

        // 팔로우 수 조회 결과를 담을 때 사용
        Integer followerCount, // 필드명 변경
        Integer followingCount,

        // 현재 로그인된 사용자의 팔로우 여부를 담을 떄 사용
        Boolean isFollowing
) {
}
