import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';

function DetailPage() {
    // URL 경로에서 movieId 파라미터를 추출합니다. 예: /movie/123 - movieId는 123
    const {movieId} = useParams();

    // 영화 상세 정보를 저장할 state
    const [movie, setMovie] = useState(null);
    // 로딩 상태를 관리할 state
    const [loading, setLoading] = useState(true);

    // 컴포넌트가 마운트되거나 movieId가 변경될 때 API를 호출합니다.
    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                setLoading(true); // 데이터 요청 시작 시 로딩 상태로 설정
                const response = await fetch(`/api/movies/${
                    movieId}`);

                if (!response.ok) {
                    // 응답이 성공적이지 않은 경우 (예: 404 Not Found)
                    throw new Error('Movie not found');
                }

                const data = await response.json();
                setMovie(data); // 받아온 데이터를 state에 저장
            } catch (error) {
                console.error("Failed to fetch movie details: ", error);
                setMovie(null); // 에러 발생 시 movie 데이터를 null로 설정
            } finally {
                setLoading(false); // 데이터 요청 완료 후 로딩 상태 해제
            }
        };

        fetchMovieDetails();
    }, [movieId]); // movieId가 변경될 때 마다 이 useEffect를 다시 실행합니다.

    // 로딩 중일 때 표시할 UI
    if (loading) {
        return <div>로딩 중...</div>;
    }

    // 영화 정보가 없을 때 표시할 UI
    if (!movie) {
        return <div>영화 정보를 찾을 수 없습니다.</div>;
    }

    // 영화 정보가 성공적으로 로드되었을 때 표시할 UI
    return (
        <div style={{padding: '20px'}}>
            <h1>{movie.movieTitle}</h1>
            <div style={{display: 'flex'}}>
                <img src={movie.posterUrl} alt={movie.movieTitle} style={{width: '300px', marginRight: '20px'}}/>
                <div>
                    <p><strong>개봉일:</strong> {movie.releaseDate}</p>
                    <p><strong>평점:</strong> {movie.voteAverage}</p>
                    <h2>줄거리</h2>
                    <p>{movie.overview}</p>
                </div>
            </div>
        </div>
    );
}

export default DetailPage;