package kopo.sideproject.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record KoficBoxOfficeResult(
        @JsonProperty("dailyBoxOfficeList") List<KoficDailyBoxOfficeItem> dailyBoxOfficeList
) {
}
