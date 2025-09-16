import React, {useState, useEffect} from 'react';
import MovieCard from '../MovieCard';

function HomePage() {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        fetch('/api/movies/now-playing')
            .then(response => response.json())
            .then(data => {
                setMovies(data);
            })
            .catch(error => console.error(' 영화 데이터를 가져오는 중 오류 발생:', error))
    }, []);

    return (
        <div>
            <h1>현재 상영 중인 영화</h1>
            <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center'}}>
                {movies.length > 0 ? (
                movies.map(movie => (
                <MovieCard key={movie.movieId} movie={movie}/>
                ))
                ) : (
                <p>영화를 불러오는 중입니다...</p>
                )}
            </div>
        </div>
    );
}

export default HomePage;