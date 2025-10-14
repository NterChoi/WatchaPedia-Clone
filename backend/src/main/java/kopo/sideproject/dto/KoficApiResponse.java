package kopo.sideproject.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public record KoficApiResponse(
        @JsonProperty("boxOfficeResult") KoficBoxOfficeResult boxOfficeResult
) {
}
