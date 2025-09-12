package kopo.sideproject.repository;

import kopo.sideproject.repository.entity.MovieEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MovieRepository extends JpaRepository<MovieEntity, Long> {

    /**
     * 영화 제목으로 영화 정보 조회
     * @param movieTitle 영화 제목
     * @return 영화 정보
     */
    Optional<MovieEntity> findByMovieTitle(String movieTitle);
}
