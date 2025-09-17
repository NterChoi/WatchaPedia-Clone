package kopo.sideproject.service.impl;

import kopo.sideproject.dto.ReviewDTO;
import kopo.sideproject.repository.MovieRepository;
import kopo.sideproject.repository.ReviewRepository;
import kopo.sideproject.repository.entity.MovieEntity;
import kopo.sideproject.repository.entity.ReviewEntity;
import kopo.sideproject.service.IReviewService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

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


    @Override
    public List<ReviewDTO> getReviewsForMovies(Long movieId) {
        log.info(this.getClass().getSimpleName(), "getReviewsForMovies Start!");

        Optional<MovieEntity> movieEntity = movieRepository.findById(movieId);

        if (movieEntity.isEmpty()) {
            log.warn("Movie not found with id: " + movieId);
            return Collections.emptyList();
        }

        List<ReviewEntity> reviewEntities = reviewRepository.findByMovie(movieEntity);

        List<ReviewDTO> dtoList = reviewEntities.stream()
                .map(ReviewDTO::fromEntity)
                .toList();

        log.info(this.getClass().getSimpleName(), "getReviewsForMovies End!");

        return dtoList;
    }
}
