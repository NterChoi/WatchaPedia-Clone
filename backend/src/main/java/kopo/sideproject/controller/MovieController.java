package kopo.sideproject.controller;

import kopo.sideproject.dto.TmdbResponseDTO;
import kopo.sideproject.service.IMovieApiService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController // 이 컨트롤러의 모든 메서드는 JSON 형태로 데이터를 반환함을 의미
@RequestMapping("/api/movies") // 이 컨트롤러는 /api/movies 로 시작하는 모든 요청을 처리합니다.
@RequiredArgsConstructor
public class MovieController {

    private final IMovieApiService movieApiService;

    @GetMapping("/now-playing")
    public TmdbResponseDTO getNowPlaying(@RequestParam(value = "page", defaultValue = "1") int page) {

        log.info(this.getClass().getName() + ".getNowPlayingMovies Start!");

        // 서비스 호출하여 영화 정보 받아오기
        TmdbResponseDTO rDTO = movieApiService.getNowPlayingMovies(page, "ko-KR");

        log.info(this.getClass().getName() + ".getNowPlayingMovies End!");

        return rDTO; // TmdbResponseDTO 객체가 JSON으로 변환되어 클라이언트에게 반환됩니다.
    }
}
