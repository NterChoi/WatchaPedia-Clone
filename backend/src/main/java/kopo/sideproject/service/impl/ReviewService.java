package kopo.sideproject.service.impl;

import kopo.sideproject.dto.ReviewDTO;
import kopo.sideproject.dto.ReviewRequestDTO;
import kopo.sideproject.dto.TmdbMovieDetailDTO;
import kopo.sideproject.repository.MovieRepository;
import kopo.sideproject.repository.ReviewRepository;
import kopo.sideproject.repository.UserInfoRepository;
import kopo.sideproject.repository.entity.MovieEntity;
import kopo.sideproject.repository.entity.ReviewEntity;
import kopo.sideproject.repository.entity.UserInfoEntity;
import kopo.sideproject.service.IReviewService;
import kopo.sideproject.util.DateUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReviewService implements IReviewService {

    private final ReviewRepository reviewRepository;
    private final MovieRepository movieRepository;
    private final UserInfoRepository  userInfoRepository;
    private final MovieApiService movieApiService;


    @Override
    public List<ReviewDTO> getReviewsForMovies(Long movieId) {
        log.info(this.getClass().getSimpleName(), "getReviewsForMovies Start!");

        Optional<MovieEntity> movieEntity = movieRepository.findById(movieId);

        if (movieEntity.isEmpty()) {
            log.warn("Movie not found with id: " + movieId);
            return Collections.emptyList();
        }

        List<ReviewEntity> reviewEntities = reviewRepository.findByMovie(movieEntity.get());

        List<ReviewDTO> dtoList = reviewEntities.stream()
                .map(ReviewDTO::fromEntity)
                .toList();

        log.info(this.getClass().getSimpleName(), "getReviewsForMovies End!");

        return dtoList;
    }

    @Override
    @Transactional
    public void postReview(Long movieId, ReviewRequestDTO reviewDTO, String userEmail) {
        log.info(this.getClass().getSimpleName(), "postReview Start!");

        log.info("movie id: " + movieId + "review: " + reviewDTO.toString());

       // 1. 리뷰를 작성할 영화 정보가 DB에 있는지 확인, 없으면 TMDB에서 가져와 저장
        MovieEntity movieEntity = movieRepository.findById(movieId)
                .orElseGet(() -> {
                    log.info("Movie with ID {} not found in DB. Fetching from TMDB" , movieId);

                    // TMDB API를 통해 영화 상세 정보 조회
                    TmdbMovieDetailDTO movieDetail = movieApiService.getMovieDetailsFromTMDB(movieId);

                    // 새로운 MovieEntity 생성
                    MovieEntity newMovieEntity = MovieEntity.builder()
                            .movieId(movieDetail.id())
                            .movieTitle(movieDetail.title())
                            .overview(movieDetail.overview())
                            .posterUrl(movieDetail.poster_path())
                            .releaseDate(movieDetail.release_date())
                            .voteAverage(movieDetail.vote_average())
                            .build();

                    // DB에 저장
                    return movieRepository.save(newMovieEntity);
                });

        // 2. 사용자 정보 조회
        UserInfoEntity userInfoEntity = userInfoRepository.findByEmail(userEmail)
                        .orElseThrow(() -> new IllegalArgumentException("User not found with email: " + userEmail));

        // 3. 리뷰 엔티티 생성 및 저장
        ReviewEntity reviewEntity = ReviewEntity.builder()
                .movie(movieEntity)
                .user(userInfoEntity)
                .rating(reviewDTO.rating())
                .content(reviewDTO.content())
                .regDt(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")))
                .build();

        reviewRepository.save(reviewEntity);

        log.info(this.getClass().getSimpleName(), "postReview End!");

    }

    @Override
    @Transactional
    public void updateReview(Long reviewId, ReviewRequestDTO review, String userEmail) {
        log.info(this.getClass().getSimpleName(), "updateReview Start!");

        log.info("review id: " + reviewId + "review: " + review.toString());

        ReviewEntity reviewEntity = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("Review not found with id: " + reviewId));

        // 권한 검사: 요청한 사용자와 리뷰 작성자가 동일한지 확인
        if (!reviewEntity.getUser().getEmail().equals(userEmail)) {
            log.warn("User {} is not authorized to update review {}", userEmail, reviewId);
            throw new IllegalArgumentException("User not authorized to update review");
        }

        reviewEntity.updateReview(review.rating(), review.content());

        log.info(this.getClass().getSimpleName(), "updateReview End!");

    }

    @Override
    @Transactional
    public void deleteReview(Long reviewId, String userEmail) {
        log.info(this.getClass().getSimpleName(), "deleteReview Start!");

        log.info("review id: " + reviewId);

        ReviewEntity reviewEntity = reviewRepository.findById(reviewId)
                        .orElseThrow(() -> new IllegalArgumentException("Review not found with id: " + reviewId));

        // 권한 검사: 요청한 사용자와 리뷰 작성자가 동일한지 확인
        if (!reviewEntity.getUser().getEmail().equals(userEmail)) {
            log.warn("User {} is not authorized to delete review {}", userEmail, reviewId);
            throw new IllegalArgumentException("User not authorized to delete review");
        }

        reviewRepository.deleteById(reviewId);

        log.info(this.getClass().getSimpleName(), "deleteReview End!");
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReviewDTO> getReviewByUserId(Long userId) {
        log.info(this.getClass().getSimpleName(), "getReviewByUserId Start!");
        log.info("userId: " + userId);

        // Repository에서 JOIN FETCH로 구현한 쿼리 호출
        List<ReviewEntity> reviewEntities = reviewRepository.findAllByUserId(userId);

        // Entity 리스트를 DTO 리스트로 변환
        List<ReviewDTO> dtoList = reviewEntities.stream()
                .map(ReviewDTO::fromEntity)
                .toList();

        log.info("Found {} reviews for user {}", dtoList.size(), userId);
        log.info(this.getClass().getSimpleName(), "getReviewByUserId End!");

        return dtoList;
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, List<ReviewDTO>> getRatingsCalender(Long userId) {
        log.info(this.getClass().getSimpleName(), "getRatingsCalender Start!");
        log.info("userId: " + userId);

        // 1. 사용자의 모든 리뷰를 영화 정보와 함께 조회
        List<ReviewEntity> reviewEntities = reviewRepository.findAllByUserId(userId);

        // 2. 리뷰 목록을 날짜(yyyy-MM-dd) 별로 그룹핑
        Map<String, List<ReviewDTO>> calendarData = reviewEntities.stream()
                .collect(Collectors.groupingBy(
                                review -> review.getRegDt().substring(0, 10),
                                Collectors.mapping(ReviewDTO::fromEntity, Collectors.toList())
                        ));

        log.info("Generated calendar data for user {}", calendarData.size());
        log.info(this.getClass().getSimpleName(), "getRatingsCalender End!");

        return calendarData;
    }
}
