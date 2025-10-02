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
        // JSON의 'poster_path' 필드를 자바의 'posterPath' 변수에 매핑합니다.
        String poster_path,
        String release_date,
        Integer runtime,
        Double vote_average,
        // 장르 정보는 이름만 추출하여 리스트로 받음
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
