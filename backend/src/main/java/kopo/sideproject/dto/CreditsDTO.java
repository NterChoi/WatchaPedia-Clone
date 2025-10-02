package kopo.sideproject.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record CreditsDTO(
         List<CastDTO> cast,
         List<CrewDTO> crew
        ) {
}
