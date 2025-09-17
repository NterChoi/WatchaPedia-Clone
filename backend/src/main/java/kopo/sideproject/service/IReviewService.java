package kopo.sideproject.service;

import kopo.sideproject.dto.ReviewDTO;

import java.util.List;

public interface IReviewService {

    List<ReviewDTO> getReviewsForMovies(Long movieId);
}
