package kopo.sideproject.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public record KoficDailyBoxOfficeItem(
        @JsonProperty("rank") String rank,         // 순위
        @JsonProperty("movieNm") String movieNm,       // 영화명 (국문)
        @JsonProperty("openDt") String openDt         // 개봉일
) {
}
