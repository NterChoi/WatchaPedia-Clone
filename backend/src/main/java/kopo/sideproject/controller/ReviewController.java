package kopo.sideproject.controller;

import kopo.sideproject.dto.ReviewDTO;
import kopo.sideproject.repository.entity.ReviewEntity;
import kopo.sideproject.service.IReviewService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@RequestMapping("/api")
@RequiredArgsConstructor
@RestController
public class ReviewController {

    private final IReviewService reviewService;

    @GetMapping("/movies/{movieId}/reviews")
    public ResponseEntity<List<ReviewDTO>> getReviewsForMovies(@PathVariable("movieId") Long movieId) {
        log.info(this.getClass().getSimpleName(), "getReviewsForMovies Start!");
        log.info("Requested movieId: " + movieId);

        List<ReviewDTO> dtoList = this.reviewService.getReviewsForMovies(movieId);

        log.info(this.getClass().getSimpleName(), "getReviewsForMovies End!");

        return ResponseEntity.ok(dtoList);
    }
}
