import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import MovieCard from '../MovieCard'; // MovieCard 컴포넌트를 재사용합니다.

function SearchPage() {
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const query = searchParams.get('query'); // URL에서 'query' 파라미터 값을 가져옵니다.

    useEffect(() => {
        // query가 존재할 때만 API를 호출합니다.
        if (query) {
            const fetchSearchResults = async () => {
                setLoading(true);
                try {
                    const response = await fetch(`/api/movies/search?query=${query}`);
                    if (!response.ok) {
                        throw new Error('Search failed');
                    }
                    const data = await response.json();
                    setSearchResults(data.results || []);
                } catch (error) {
                    console.error("Error fetching search results:", error);
                    setSearchResults([]);
                } finally {
                    setLoading(false);
                }
            };

            fetchSearchResults();
        }
    }, [query]); // query가 바뀔 때마다 useEffect가 다시 실행됩니다.

    if (loading) {
        return <div>검색 중...</div>;
    }

    return (
        <div style={{ padding: '20px' }}>
            <h1>'{query}'에 대한 검색 결과</h1>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                {searchResults.length > 0 ? (
                    searchResults.map(movie => (
                        // MovieCard에 필요한 props 형식에 맞춰 데이터를 전달합니다.
                        <MovieCard
                            key={movie.id}
                            movie={{
                                movieId: movie.id,
                                movieTitle: movie.title,
                                posterUrl: movie.poster_path
                                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                                    : 'https://via.placeholder.com/500x750?text=No+Image' // 포스터 없을 때 대체 이미지
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
