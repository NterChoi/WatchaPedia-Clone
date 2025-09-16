package kopo.sideproject.controller;

import kopo.sideproject.dto.TmdbResponseDTO;
import kopo.sideproject.repository.entity.MovieEntity;
import kopo.sideproject.service.IMovieApiService;
import kopo.sideproject.service.impl.MovieApiService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController // 이 컨트롤러의 모든 메서드는 JSON 형태로 데이터를 반환함을 의미
@RequestMapping("/api/movies") // 이 컨트롤러는 /api/movies 로 시작하는 모든 요청을 처리합니다.
@RequiredArgsConstructor
public class MovieController {

    private final MovieApiService movieApiService;

    /**
     *
     * 데이터베이스에 저장된 현재 상영 중인 영화 목록을 조회합니다.
     * React에서 이 API를 호출하여 메인 페이지에 영화 목록을 표시합니다.
     * @return 영화 목록 JSON 데이터
     */
    @GetMapping("/now-playing")
    public ResponseEntity<List<MovieEntity>> getNowPlaying() {

        log.info(this.getClass().getName() + ".getNowPlayingMovies Start!");

        // 서비스 호출하여 영화 정보 받아오기
        List<MovieEntity> movieList = movieApiService.getNowPlayingMovies();

        log.info(this.getClass().getName() + ".getNowPlayingMovies End!");

        return ResponseEntity.ok(movieList);
    }

    @GetMapping("/{movieId}")
    public ResponseEntity<MovieEntity> getMovieById(@PathVariable("movieId") Long movieId) {
        log.info(this.getClass().getName() + ".getMovieByIdMovies Start!");
        log.info("Requested movieId: " + movieId);

        MovieEntity movie = movieApiService.getMovieDetails(movieId);

        if (movie != null) {
            // 영화 정보가 있으면 200 OK 상태와 함꼐 영화 데이터를 반환
            log.info("Found movie: " + movie.getMovieTitle());
            return ResponseEntity.ok(movie);
        } else {
            // 영화 정보가 없으면 404 Not Found 상태를 반환
            log.warn("Movie not found with id: " + movieId);
            return ResponseEntity.notFound().build();
        }
    }
}
