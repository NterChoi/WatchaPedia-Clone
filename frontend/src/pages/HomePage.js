import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';

import StarRating from '../components/StarRating';

// react-slick의 CSS를 가져옵니다.
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function HomePage() {
    const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
    const [boxOfficeMovies, setBoxOfficeMovies] = useState([]);
    const [upcomingMovies, setUpcomingMovies] = useState([]); // 개봉 예정작 상태 추가
    const [userRatings, setUserRatings] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMoviesAndRatings = async () => {
            setLoading(true);
            try {
                const [nowPlayingRes, boxOfficeRes, upcomingRes, ratingsRes] = await Promise.all([
                    fetch('/api/movies/now-playing'),
                    fetch('/api/movies/box-office'),
                    fetch('/api/movies/upcoming'), // 개봉 예정작 API 호출 추가
                    fetch('/api/reviews/me')
                ]);

                const nowPlayingData = await nowPlayingRes.json();
                const boxOfficeData = await boxOfficeRes.json();
                const upcomingData = await upcomingRes.json(); // 데이터 파싱
                const ratingsData = await ratingsRes.json();

                setNowPlayingMovies(nowPlayingData.results || []);
                setBoxOfficeMovies(boxOfficeData || []);
                setUpcomingMovies(upcomingData.results || []); // 상태 업데이트

                if (ratingsData) {
                    const ratingsMap = ratingsData.reduce((acc, review) => {
                        acc[review.movieId] = review.rating;
                        return acc;
                    }, {});
                    setUserRatings(ratingsMap);
                }

            } catch (error) {
                console.error('데이터를 가져오는 중 오류 발생:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMoviesAndRatings();
    }, []);

    const sliderSettings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 5,
        responsive: [
            { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 3 } },
            { breakpoint: 600, settings: { slidesToShow: 2, slidesToScroll: 2 } }
        ]
    };

    const renderMovieSlider = (movies) => {
        if (loading) return <p>영화를 불러오는 중입니다...</p>;
        if (!movies || movies.length === 0) return <p>표시할 영화가 없습니다.</p>;
        
        return (
            <Slider {...sliderSettings}>
                {movies.map(movie => {
                    const userRating = userRatings[movie.id];
                    const isRated = userRating !== undefined;
                    const ratingToShow = isRated ? userRating : (movie.vote_average / 2);

                    return (
                        <div key={movie.id} style={{ padding: '10px' }}>
                            <Link to={`/movie/${movie.id}`}>
                                <img
                                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                    alt={movie.title}
                                    style={{ width: '100%', borderRadius: '8px', marginBottom: '10px' }}
                                />
                            </Link>
                            <div style={{ padding: '0 5px' }}>
                                <h4 style={{ fontSize: '16px', fontWeight:'bold', color: '#333', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{movie.title}</h4>
                                <div style={{display: 'flex', alignItems: 'center', marginTop: '5px'}}>
                                    <span style={{ fontSize: '13px', color: isRated ? '#FF4081' : '#555', fontWeight: 'bold' }}>
                                        {isRated ? '평가함' : '평균'}
                                    </span>
                                    <StarRating rating={ratingToShow} size={16} />
                                    <span style={{marginLeft: '8px', fontSize: '14px', color: '#555'}}>
                                        {ratingToShow.toFixed(1)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </Slider>
        );
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1 style={{ marginBottom: '20px' }}>현재 상영 중인 영화</h1>
            {renderMovieSlider(nowPlayingMovies)}

            <h1 style={{ marginTop: '50px', marginBottom: '20px' }}>일별 박스오피스 순위</h1>
            {renderMovieSlider(boxOfficeMovies)}

            <h1 style={{ marginTop: '50px', marginBottom: '20px' }}>개봉 예정인 영화</h1>
            {renderMovieSlider(upcomingMovies)}
        </div>
    );
}

export default HomePage;
