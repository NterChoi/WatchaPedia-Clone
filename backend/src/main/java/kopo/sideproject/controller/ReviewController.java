package kopo.sideproject.controller;

import kopo.sideproject.dto.ReviewDTO;
import kopo.sideproject.dto.ReviewRequestDTO;
import kopo.sideproject.dto.UserInfoDTO;
import kopo.sideproject.repository.entity.ReviewEntity;
import kopo.sideproject.service.IReviewService;
import kopo.sideproject.service.impl.UserInfoService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
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
    private final UserInfoService userInfoService;

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
    public ResponseEntity<Void> updateReview(@PathVariable("reviewId") Long reviewId, @RequestBody ReviewRequestDTO reviewDTO, Principal principal) {
        log.info(this.getClass().getSimpleName(), "updateReview Start!");
        log.info("reviewId: " + reviewId);

        String userEmail = principal.getName();

        this.reviewService.updateReview(reviewId, reviewDTO, userEmail);

        log.info(this.getClass().getSimpleName(), "updateReview End!");

        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/reviews/{reviewId}")
    public ResponseEntity<Void> deleteReview(@PathVariable("reviewId") Long reviewId, Principal principal) {
        log.info(this.getClass().getSimpleName(), "deleteReview Start!");
        log.info("reviewId: " + reviewId);

        String userEmail = principal.getName();

        this.reviewService.deleteReview(reviewId, userEmail);

        log.info(this.getClass().getSimpleName(), "deleteReview End!");

        return ResponseEntity.ok().build();
    }

    @GetMapping("/me")
    public ResponseEntity<UserInfoDTO> getMyInfo(Principal principal) throws Exception{
        log.info(this.getClass().getSimpleName(), "getMyInfo Start!");

        // Pricipal 객체가 null 이면, 사용자가 인증되지 않았다는 의미
        if (principal == null) {
            log.warn("Principal is null!, user is not authenticated");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // Principal.getName()은 로그인 시 설정한 사용자의 고유 식별자(여기서는 이메일)를 반환
        String userEmail = principal.getName();
        log.info("userEmail from Principal: {}", userEmail);

        // 이메일을 사용하여 서비스로부터 사용자 정보 조회
        UserInfoDTO rDTO = userInfoService.getUserInfo(userEmail);

        if (rDTO != null) {
            // 사용자 정보가 있으면 DTO를 담아 200 OK 응답 반환
            log.info("User info found: {}", rDTO);
            return ResponseEntity.ok(rDTO);
        } else {
            // 비정상적인 경우 : 인증은 되었으니 DB에 사용자 정보가 없는 경우
            log.error("User authenticated as {} but not found in DB.", userEmail);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/user/{userId}/reviews")
    public ResponseEntity<List<ReviewDTO>> getReviewsByUserId(@PathVariable("userId") Long userId) {
        log.info(this.getClass().getSimpleName(), "getReviewsByUserId Start!");
        log.info("userId: " + userId);

        List<ReviewDTO> dtoList = reviewService.getReviewByUserId(userId);

        log.info(this.getClass().getSimpleName(), "getReviewsByUserId End!");

        return ResponseEntity.ok(dtoList);
    }
}
