package kopo.sideproject.repository;

import kopo.sideproject.repository.entity.MovieEntity;
import kopo.sideproject.repository.entity.ReviewEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<ReviewEntity, Long> {
    List<ReviewEntity> findByMovie(MovieEntity movie);

    @Query("SELECT r FROM ReviewEntity r JOIN FETCH r.movie WHERE r.user.id = :userId")
    List<ReviewEntity> findAllByUserId(@Param("userId") Long userId);
}
