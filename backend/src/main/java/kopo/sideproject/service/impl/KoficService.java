package kopo.sideproject.service.impl;

import kopo.sideproject.dto.KoficDailyBoxOfficeItem;
import kopo.sideproject.dto.TmdbResponseDTO;
import kopo.sideproject.service.IKoficApiService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class KoficService {

    private final IKoficApiService koficApiService;
    private final MovieApiService movieApiService; // TMDB 검색을 위해 기존 서비스 주입

    /**
     * KOFIC 일별 박스오피스 API를 호출하고, 각 영화의 상세 정보를 TMDB에서 가져와 조합합니다.
     */
    public List<TmdbResponseDTO.MovieResultDto> getDailyBoxOfficeAndMergeWithTmdb() {
        log.info(this.getClass().getSimpleName() + ".getDailyBoxOfficeAndMergeWithTmdb Start!");

        // 1. 어제 날짜를 yyyyMMdd 형식으로 계산
        String targetDt = LocalDate.now().minusDays(1).format(DateTimeFormatter.ofPattern("yyyyMMdd"));

        // 2. KOFIC API 호출
        List<KoficDailyBoxOfficeItem> koficMovies = koficApiService.getDailyBoxOffice(targetDt)
                .boxOfficeResult()
                .dailyBoxOfficeList();

        if (koficMovies == null || koficMovies.isEmpty()) {
            log.warn("KOFIC에서 박스오피스 정보를 가져오지 못했습니다.");
            return Collections.emptyList();
        }

        // 3. KOFIC 영화 목록을 순회하며 TMDB 정보와 조합
        List<TmdbResponseDTO.MovieResultDto> mergedList = koficMovies.stream()
                .map(koficMovie -> {
                    try {
                        // 4. TMDB에서 영화명으로 검색
                        List<TmdbResponseDTO.MovieResultDto> tmdbResults = movieApiService.searchMovies(koficMovie.movieNm(), 1).results();

                        if (tmdbResults != null && !tmdbResults.isEmpty()) {
                            // 5. 검색 결과의 첫 번째 영화를 매칭된 영화로 간주
                            return tmdbResults.get(0);
                        } else {
                            log.warn("TMDB에서 '" + koficMovie.movieNm() + "'에 대한 검색 결과가 없습니다.");
                            return null; // 매칭 실패 시 null 반환
                        }
                    } catch (Exception e) {
                        log.error("'" + koficMovie.movieNm() + "' 처리 중 오류 발생", e);
                        return null;
                    }
                })
                .filter(Objects::nonNull) // null인 항목(매칭 실패)은 리스트에서 제거
                .collect(Collectors.toList());

        log.info(this.getClass().getSimpleName() + ".getDailyBoxOfficeAndMergeWithTmdb End!");

        return mergedList;
    }
}
