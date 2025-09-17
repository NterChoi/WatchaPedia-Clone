package kopo.sideproject.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;

@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public record ReviewRequestDTO(
        String email,
        Long movieId,
        Double rating,
        String content
) {
}
