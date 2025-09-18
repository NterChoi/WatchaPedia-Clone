package kopo.sideproject.service;

import kopo.sideproject.dto.ReviewDTO;
import kopo.sideproject.dto.ReviewRequestDTO;

import java.util.List;

public interface IReviewService {

    List<ReviewDTO> getReviewsForMovies(Long movieId);

    void postReview(Long movieId, ReviewRequestDTO review);
}
