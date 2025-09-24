package kopo.sideproject.service;

import kopo.sideproject.config.TmdbFeignConfig;
import kopo.sideproject.dto.TmdbMovieDetailDTO;
import kopo.sideproject.dto.TmdbResponseDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "tmdb-api", url = "${tmdb.api.url}", configuration = TmdbFeignConfig.class)
public interface IMovieApiService {

    /**
     * TMDB API로부터 현재 상영 중인 영화 목록을 가져옵니다.
     *
     * @param page 조회할 페이지 번호
     * @return TMDB API 응답 DTO
     */
    @GetMapping("/movie/now_playing")
    TmdbResponseDTO getNowPlayingMovies(
            @RequestParam("page") int page,
            @RequestParam("language") String language
    );

    @GetMapping("/movie/popular")
    TmdbResponseDTO getPopularMovies(
            @RequestParam("page") int page,
            @RequestParam("language") String language
    );

    /**
     * TMDB API를 사용하여 영화를 검색
     * @param query 검색할 키워드
     * @param page 검색 페이지 번호
     * @param language 응답 언어
     * @return 검색된 영화 목록을 포함함는 응답 DTO
     */
    @GetMapping("/search/movie")
    TmdbResponseDTO getSearchMovies(@RequestParam("query") String query, @RequestParam("page") int page, @RequestParam("language") String language);

    @GetMapping("/movie/{movie_id}")
    TmdbMovieDetailDTO getMovieDetailsByTmdbId(@PathVariable("movie_id") Long tmdbId, @RequestParam("language") String language);
}
