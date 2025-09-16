import React from 'react';
import {Link} from 'react-router-dom';

// MovieCard 컴포넌트는 부모(App.js)로부터 'movie'라는 이름의 데이터를 전달받습니다.
// { movie }는 전달받은 데이터 묶음에서 movie 속성만 바로 추출해서 사용하는 문법입니다.
function MovieCard({movie}) {
    // 이 컴포넌트는 영화 카드 하나의 UI를 책임집니다.
    return (
        <Link to={`/movie/${movie.movieId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{margin: '20px', maxWidth: '200px'}}>
                <img src={movie.posterUrl} alt={movie.movieTitle} style={{width: '100%'}}/>
                <h4 style={{fontSize: '16px'}}>{movie.movieTitle}</h4>
            </div>
        </Link>
    );
}

// 다른 파일에서 <MovieCard /> 형태로 이 컴포넌트를 사용할 수 있도록 내보냅니다.
export default MovieCard;