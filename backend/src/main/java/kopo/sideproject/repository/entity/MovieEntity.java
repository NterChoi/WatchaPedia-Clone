package kopo.sideproject.repository.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;


@Getter
@Builder
@AllArgsConstructor
@Slf4j
@NoArgsConstructor
@Entity
@Table(name = "movie")
public class MovieEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "movie_pk")
    private Long moviePk;

    @Column(unique = true, nullable = false)
    private Long tmdbId; // TMDB ID

    @Column(name = "movie_title", nullable = false)
    private String title;

    @Column(name = "release_date")
    private String releaseDate;


    private String posterPath;

    @Column(name = "overview", length = 2000)
    private String overview;

    @Column(name = "vote_average")
    private double voteAverage;
}
