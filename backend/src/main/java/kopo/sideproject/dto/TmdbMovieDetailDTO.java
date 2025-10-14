package kopo.sideproject.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record TmdbMovieDetailDTO(
        Long id,
        String title,
        @JsonProperty("original_title")
        String originalTitle,
        String overview,
        @JsonProperty("poster_path")
        String poster_path,
        @JsonProperty("backdrop_path")
        String backdrop_path,
        @JsonProperty("release_date")
        String release_date,
        Integer runtime,
        @JsonProperty("vote_average")
        Double vote_average,
        String tagline,
        List<GenreDTO> genres,
        @JsonProperty("production_countries")
        List<CountryDTO> productionCountries,
        CreditsDTO credits,
        ImagesDTO images
) {
    // TmdbMovieDetailDTO 안에서만 사용할 간단한 장르 DTO를 정의
    @JsonIgnoreProperties(ignoreUnknown = true)
    public record GenreDTO(String name) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record CountryDTO(
            @JsonProperty("iso_3166_1")
            String code,
            String name) {}
}
