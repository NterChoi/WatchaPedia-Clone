package kopo.sideproject.service.impl;

import kopo.sideproject.dto.TmdbMovieDetailDTO;
import kopo.sideproject.dto.TmdbResponseDTO;
import kopo.sideproject.repository.MovieRepository;
import kopo.sideproject.repository.entity.MovieEntity;
import kopo.sideproject.service.IMovieApiService;
import feign.FeignException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class MovieApiService {

    @Value("${tmdb.api.key}")
    private String apiKey;

    // Feign Client를 주입받습니다.
    private final IMovieApiService movieApiService;

    private final MovieRepository movieRepository;

    public void saveNowPlayingMovies(int page) {
        log.info(this.getClass().getName() + ".saveNowPlayingMovies Start!");

        TmdbResponseDTO response = movieApiService.getNowPlayingMovies( page, "ko-KR", "KR");

        if (response != null && response.results() != null) {

            response.results().forEach(movieDto -> {
                // 이미 해당 영화가 DB에 저장되어 있는지 tmdbId로 확인
                if (!movieRepository.findByTmdbId(movieDto.id()).isPresent()) {
                    MovieEntity movieEntity = MovieEntity.builder()
                            .tmdbId(movieDto.id())
                            .title(movieDto.title())
                            .posterPath(movieDto.posterPath())
                            .overview(movieDto.overview())
                            .voteAverage(movieDto.voteAverage())
                            .releaseDate(movieDto.releaseDate())
                            .build();

                    movieRepository.save(movieEntity);
                    log.info(movieDto.title() + " 저장 완료");
                }
            });

        }

        log.info(this.getClass().getName() + ".saveNowPlayingMovies End!");

    }

    public List<MovieEntity> getNowPlayingMovies() {
        log.info(this.getClass().getName() + ".getNowPlayingMovies Start!");

        List<MovieEntity> movieList = movieRepository.findAll();

        log.info(this.getClass().getName() + ".getNowPlayingMovies End!");

        return movieList;
    }

    public MovieEntity getMovieDetails(Long movieId) {
        log.info(this.getClass().getName() + ".getMovieDetails Start!");

        // JpaRepository의 findById는 Optional<T>를 반환.
        Optional<MovieEntity> movieEntityOptional = movieRepository.findById(movieId);

        // Optional 객체가 비어있을 경우(결과 없음) null 을 반환.
        MovieEntity movieEntity = movieEntityOptional.orElse(null);

        log.info(this.getClass().getName() + ".getMovieDetails End!");

        return movieEntity;
    }

    public TmdbResponseDTO getPopularMovies(int page) {
        log.info(this.getClass().getName() + ".getPopularMovies Start!");

        // Feign Client를 사용하여 TMDB API 호출
        TmdbResponseDTO response = movieApiService.getPopularMovies( page, "ko-KR");

        log.info(this.getClass().getName() + ".getPopularMovies End!");

        return response;
    }

    public TmdbResponseDTO getNowPlayingMoviesFromTMDB(int page) {
        log.info(this.getClass().getName() + ".getNowPlayingMoviesFromTMDB Start!");

        // Feign Client를 사용하여 TMDB API 호출
        TmdbResponseDTO response = movieApiService.getNowPlayingMovies(page, "ko-KR", "KR");

        log.info(this.getClass().getName() + ".getNowPlayingMoviesFromTMDB End!");

        return response;
    }

    public TmdbResponseDTO searchMovies(String query, int page) {
        log.info(this.getClass().getName() + ".searchMovies Start!");

        TmdbResponseDTO responseDTO = movieApiService.getSearchMovies( query, page, "ko-KR");

        log.info(this.getClass().getName() + ".searchMovies End!");

        return responseDTO;
    }

    public TmdbMovieDetailDTO getMovieDetailsFromTMDB(Long tmdbId) {
        log.info(this.getClass().getName() + ".getMovieDetailsFromTMDB Start!");

        try {
            // Feign Client를 사용하여 TMDB API에서 영화 상세 정보 호출
                        TmdbMovieDetailDTO rDTO = movieApiService.getMovieDetailsByTmdbId(tmdbId, "ko-KR", "credits,images", "en,null");

            log.info(this.getClass().getName() + ".getMovieDetailsFromTMDB End!");

            return rDTO;
        } catch (FeignException e) {
            log.error("TMDB API call failed for tmdbId: {}. Status: {}, Body: {}", tmdbId, e.status(), e.contentUTF8(), e);
            // 예외를 다시 던져서 상위 서비스에서 트랜잭션 롤백이 일어나도록 함
            throw e;
        }
    }

    public TmdbResponseDTO getUpcomingMoviesFromTMDB(int page) {
        log.info(this.getClass().getName() + ".getUpcomingMovies Start!");

        // Feign Client를 사용하여 TMDB API 호출
        TmdbResponseDTO response = movieApiService.getUpcomingMovies(page, "ko-KR", "KR");

        log.info(this.getClass().getName() + ".getUpcomingMovies End!");

        return response;
    }
}
