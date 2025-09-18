package kopo.sideproject.service.impl;

import kopo.sideproject.dto.ReviewDTO;
import kopo.sideproject.dto.ReviewRequestDTO;
import kopo.sideproject.repository.MovieRepository;
import kopo.sideproject.repository.ReviewRepository;
import kopo.sideproject.repository.UserInfoRepository;
import kopo.sideproject.repository.entity.MovieEntity;
import kopo.sideproject.repository.entity.ReviewEntity;
import kopo.sideproject.repository.entity.UserInfoEntity;
import kopo.sideproject.service.IReviewService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReviewService implements IReviewService {

    private final ReviewRepository reviewRepository;
    private final MovieRepository movieRepository;
    private final UserInfoRepository  userInfoRepository;


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
    public void postReview(Long movieId, ReviewRequestDTO reviewDTO) {
        log.info(this.getClass().getSimpleName(), "postReview Start!");

        log.info("movie id: " + movieId + "review: " + reviewDTO.toString());

        MovieEntity movieEntity = movieRepository.findById(movieId).orElseThrow(() -> new IllegalArgumentException("Movie not found with id: " + movieId));

        UserInfoEntity userInfoEntity = userInfoRepository.findByEmail(reviewDTO.email()).orElseThrow(() -> new IllegalArgumentException("User not found with email: " + reviewDTO.email()));


        ReviewEntity reviewEntity = ReviewEntity.builder()
                .movie(movieEntity)
                .user(userInfoEntity)
                .rating(reviewDTO.rating())
                .content(reviewDTO.content())
                .build();

        reviewRepository.save(reviewEntity);

        log.info(this.getClass().getSimpleName(), "postReview End!");

    }
}
