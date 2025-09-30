package kopo.sideproject.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;

@Builder
@JsonInclude(JsonInclude.Include.NON_DEFAULT)
public record UserInfoDTO(
        Long id,
        String email,
        String password,
        String nickname,
        String profileImg, // 프로필 이미지 경로
        String existsYn // 회원아이디 존재 여부
) {
}
