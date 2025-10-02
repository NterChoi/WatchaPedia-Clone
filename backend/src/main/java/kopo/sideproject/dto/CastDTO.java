package kopo.sideproject.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;


@JsonIgnoreProperties(ignoreUnknown = true)
public record CastDTO(
         String name,
         @JsonProperty("profile_path")
         String profilePath,
         String character
) {
}
