package kopo.sideproject.controller;

import kopo.sideproject.dto.MsgDTO;
import kopo.sideproject.service.impl.MovieApiService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RequestMapping("/load")
@RestController
@RequiredArgsConstructor
public class DataLoadController {

    private final MovieApiService movieApiService;

    @GetMapping("/now-playing")
    public ResponseEntity<MsgDTO> uploadNowPlaying() throws Exception{
        log.info(this.getClass().getName() + ".uploadNowPlaying Start!");

        MsgDTO dto;

        try {
            movieApiService.getNowPlayingMovies(1);

                        dto = MsgDTO.builder().msg("TMDB 현재 상영작 정보 저장 성공!").build();
        }catch (Exception e){
            log.error("Error in uploadNowPlaying!", e);

            dto = MsgDTO.builder().msg("TMDB 영화 정보 로드 실패: " + e.getMessage()).build();

            return ResponseEntity.internalServerError().body(dto);
        }

        log.info(this.getClass().getName() + ".uploadNowPlaying End!");

        return ResponseEntity.ok(dto);
    }

}
