package kopo.sideproject.controller;

import kopo.sideproject.dto.ReviewDTO;
import kopo.sideproject.dto.ReviewRequestDTO;
import kopo.sideproject.repository.entity.ReviewEntity;
import kopo.sideproject.service.IReviewService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;

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

    @PostMapping("/movies/{movieId}/reviews")
    public ResponseEntity<Void> postReview(@PathVariable("movieId") Long movieId, @RequestBody ReviewRequestDTO reviewDTO, Principal principal) {
        log.info(this.getClass().getSimpleName(), "postReview Start!");

        // 2. Principal 객체에서 현재 로그인된 사용자의 이메일 가져오기
        String userEmail = principal.getName();

        log.info("Requested movieId: " + movieId);
        log.info("Requested reviewDTO: " + reviewDTO);
        log.info("User Email from Session: " + userEmail);

        this.reviewService.postReview(movieId, reviewDTO,  userEmail);

        log.info(this.getClass().getSimpleName(), "postReview End!");

        return ResponseEntity.ok().build();

    }

    @PutMapping("/reviews/{reviewId}")
    public ResponseEntity<Void> updateReview(@PathVariable("reviewId") Long reviewId, @RequestBody ReviewRequestDTO reviewDTO) {
        log.info(this.getClass().getSimpleName(), "updateReview Start!");
        log.info("reviewId: " + reviewId);

        this.reviewService.updateReview(reviewId, reviewDTO);

        log.info(this.getClass().getSimpleName(), "updateReview End!");

        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/reviews/{reviewId}")
    public ResponseEntity<Void> deleteReview(@PathVariable("reviewId") Long reviewId) {
        log.info(this.getClass().getSimpleName(), "deleteReview Start!");
        log.info("reviewId: " + reviewId);
        this.reviewService.deleteReview(reviewId);

        log.info(this.getClass().getSimpleName(), "deleteReview End!");

        return ResponseEntity.ok().build();
    }
}
