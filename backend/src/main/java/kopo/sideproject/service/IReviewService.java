package kopo.sideproject.service;

import kopo.sideproject.dto.ReviewDTO;
import kopo.sideproject.dto.ReviewRequestDTO;

import java.util.List;
import java.util.Map;

public interface IReviewService {

    List<ReviewDTO> getReviewsForMovies(Long movieId);

    void postReview(Long movieId, ReviewRequestDTO review, String userEmail);

    void updateReview(Long reviewId, ReviewRequestDTO review, String userEmail);

    void deleteReview(Long reviewId, String userEmail);

    List<ReviewDTO> getReviewByUserId(Long userId);

    Map<String, List<ReviewDTO>> getRatingsCalender(Long userId);
}
