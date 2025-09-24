import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';

// react-slick의 CSS를 가져옵니다.
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function HomePage() {
    // '현재 상영작'과 '인기 영화' 목록을 저장할 두 개의 상태를 만듭니다.
    const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
    const [popularMovies, setPopularMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 데이터를 가져오는 비동기 함수
        const fetchMovies = async () => {
            setLoading(true);
            try {
                // 두 API를 동시에 호출하여 병렬로 데이터를 가져옵니다.
                const [nowPlayingRes, popularRes] = await Promise.all([
                    fetch('/api/movies/now-playing'),
                    fetch('/api/movies/popular')
                ]);

                const nowPlayingData = await nowPlayingRes.json();
                const popularData = await popularRes.json();

                // 각 API 응답의 results 배열을 상태에 저장합니다.
                setNowPlayingMovies(nowPlayingData.results || []);
                setPopularMovies(popularData.results || []);

            } catch (error) {
                console.error('영화 데이터를 가져오는 중 오류 발생:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, []);

    // 슬라이더의 설정을 정의합니다.
    const sliderSettings = {
        dots: false, // 아래 점 표시 안함
        infinite: true, // 무한 반복
        speed: 500, // 넘어가는 속도
        slidesToShow: 5, // 한 번에 보여줄 슬라이드 개수
        slidesToScroll: 5, // 한 번에 넘길 슬라이드 개수
        responsive: [ // 반응형 웹 설정
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                }
            }
        ]
    };

    // 영화 포스터를 렌더링하는 함수
    const renderMovieSlider = (movies) => {
        if (loading) {
            return <p>영화를 불러오는 중입니다...</p>;
        }
        if (!movies || movies.length === 0) {
            return <p>표시할 영화가 없습니다.</p>;
        }
        return (
            <Slider {...sliderSettings}>
                {movies.map(movie => (
                    <div key={movie.id} style={{ padding: '10px' }}>
                        <Link to={`/movie/${movie.id}`}>
                            <img
                                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                alt={movie.title}
                                style={{ width: '100%', borderRadius: '10px' }}
                            />
                        </Link>
                        <h4 style={{ fontSize: '16px', textAlign: 'center', marginTop: '10px' }}>{movie.title}</h4>
                    </div>
                ))}
            </Slider>
        );
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1 style={{ marginBottom: '20px' }}>현재 상영 중인 영화</h1>
            {renderMovieSlider(nowPlayingMovies)}

            <h1 style={{ marginTop: '50px', marginBottom: '20px' }}>박스오피스 순위 (인기 영화)</h1>
            {renderMovieSlider(popularMovies)}
        </div>
    );
}

export default HomePage;
