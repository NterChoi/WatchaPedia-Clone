import React from 'react';
import { Link } from 'react-router-dom';
import StarRating from './components/StarRating';

function MovieCard({ movie }) {
    const isRated = movie.userRating !== undefined;
    const ratingToShow = isRated ? movie.userRating : (movie.voteAverage / 2);

    return (
        <Link to={`/movie/${movie.movieId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ margin: '20px', width: '200px' }}>
                <img 
                    src={movie.posterUrl} 
                    alt={movie.movieTitle} 
                    style={{ width: '100%', borderRadius: '8px', marginBottom: '10px' }} 
                />
                <div style={{ padding: '0 5px' }}>
                    <h4 style={{ fontSize: '16px', fontWeight:'bold', color: '#333', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {movie.movieTitle}
                    </h4>
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
        </Link>
    );
}

export default MovieCard;