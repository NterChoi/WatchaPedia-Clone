package kopo.sideproject.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

@JsonInclude(JsonInclude.Include.NON_DEFAULT)
public record TmdbResponseDTO(
        List<MovieResultDto> results,
        @JsonProperty("total_pages")
        int totalPages,
        @JsonProperty("total_results")
        int totalResults
) {
    @JsonIgnoreProperties(ignoreUnknown = true)
    public record MovieResultDto(
            Long id,
            String title,
            String overview,
            @JsonProperty("poster_path") String posterPath,
            @JsonProperty("release_date") String releaseDate,
            @JsonProperty("genre_ids") List<Integer> genreIds,
            @JsonProperty("vote_average") double voteAverage
    ){}
}


