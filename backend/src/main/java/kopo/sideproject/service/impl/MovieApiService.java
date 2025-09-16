package kopo.sideproject.service.impl;

import kopo.sideproject.dto.TmdbResponseDTO;
import kopo.sideproject.repository.MovieRepository;
import kopo.sideproject.repository.entity.MovieEntity;
import kopo.sideproject.service.IMovieApiService;
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

        TmdbResponseDTO response = movieApiService.getNowPlayingMovies( page, "ko-KR");

        if (response != null && response.results() != null) {

            response.results().forEach(movieDto -> {
                MovieEntity movieEntity = MovieEntity.builder()
                        .movieTitle(movieDto.title())
                        .posterUrl("https://image.tmdb.org/t/p/w500" + movieDto.posterPath())
                        .overview(movieDto.overview())
                        .voteAverage(movieDto.voteAverage())
                        .releaseDate(movieDto.releaseDate())
                        .genreIds(movieDto.genreIds().toString())
                        .build();

                movieRepository.save(movieEntity);
                log.info(movieDto.title() + " 저장 완료");
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

}
