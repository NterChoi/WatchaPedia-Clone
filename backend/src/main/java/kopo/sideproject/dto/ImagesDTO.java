package kopo.sideproject.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;


import java.util.List;


@JsonIgnoreProperties(ignoreUnknown = true)
public record ImagesDTO(
        List<ImageDTO> backdrops,
        List<ImageDTO> logos,
        List<ImageDTO> posters
) {
}
