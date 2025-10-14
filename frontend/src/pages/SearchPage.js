import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import MovieCard from '../MovieCard';

function SearchPage() {
    const [searchResults, setSearchResults] = useState([]);
    const [userRatings, setUserRatings] = useState({}); // 사용자 평가 정보 상태 추가
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const query = searchParams.get('query');

    useEffect(() => {
        if (query) {
            const fetchSearchData = async () => {
                setLoading(true);
                try {
                    // 영화 검색 결과와 사용자 평가 정보를 동시에 호출
                    const [searchRes, ratingsRes] = await Promise.all([
                        fetch(`/api/movies/search?query=${query}`),
                        fetch('/api/reviews/me')
                    ]);

                    if (!searchRes.ok) throw new Error('Search failed');
                    
                    const searchData = await searchRes.json();
                    const ratingsData = await ratingsRes.json();

                    setSearchResults(searchData.results || []);

                    if (ratingsData) {
                        const ratingsMap = ratingsData.reduce((acc, review) => {
                            acc[review.movieId] = review.rating;
                            return acc;
                        }, {});
                        setUserRatings(ratingsMap);
                    }

                } catch (error) {
                    console.error("Error fetching search data:", error);
                    setSearchResults([]);
                } finally {
                    setLoading(false);
                }
            };

            fetchSearchData();
        }
    }, [query]);

    if (loading) {
        return <div>검색 중...</div>;
    }

    return (
        <div style={{ padding: '20px' }}>
            <h1>'{query}'에 대한 검색 결과</h1>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                {searchResults.length > 0 ? (
                    searchResults.map(movie => (
                        <MovieCard
                            key={movie.id}
                            movie={{
                                movieId: movie.id,
                                movieTitle: movie.title,
                                posterUrl: movie.poster_path
                                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                                    : 'https://via.placeholder.com/500x750?text=No+Image',
                                voteAverage: movie.vote_average,
                                userRating: userRatings[movie.id] // userRating prop 전달
                            }}
                        />
                    ))
                ) : (
                    <p>검색 결과가 없습니다.</p>
                )}
            </div>
        </div>
    );
}

export default SearchPage;
