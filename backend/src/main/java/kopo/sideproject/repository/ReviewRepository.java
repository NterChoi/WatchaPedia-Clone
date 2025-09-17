package kopo.sideproject.repository;

import kopo.sideproject.repository.entity.MovieEntity;
import kopo.sideproject.repository.entity.ReviewEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<ReviewEntity, Long> {
    List<ReviewEntity> findByMovie(Optional<MovieEntity> movie);

    MovieEntity movie(MovieEntity movie);
}
