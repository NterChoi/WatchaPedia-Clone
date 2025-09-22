import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';

function DetailPage() {
    const {movieId} = useParams();
    const [movie, setMovie] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    // 리뷰 폼 상태
    const [userEmail, setUserEmail] = useState('');
    const [rating, setRating] = useState(0);
    const [content, setContent] = useState('');


    const fetchMovieData = async () => {
        try {
            setLoading(true);
            // 영화 상세 정보 가져오기
            const movieResponse = await fetch(`/api/movies/${movieId}`);
            if (!movieResponse.ok) throw new Error('Movie not found');
            const movieData = await movieResponse.json();
            setMovie(movieData);

            // 리뷰 목록 가져오기
            const reviewsResponse = await fetch(`/api/movies/${movieId}/reviews`);
            if (!reviewsResponse.ok) throw new Error('Failed to fetch reviews');
            const reviewsData = await reviewsResponse.json();
            setReviews(reviewsData);

        } catch (error) {
            console.error("Failed to fetch movie data: ", error);
            setMovie(null);
            setReviews([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMovieData();
    }, [movieId]);

    const handleReviewSubmit = async (e) => {
        e.preventDefault();

        // 간단한 유효성 검사
        if (!userEmail || rating === 0 || !content) {
            alert("이메일, 평점, 리뷰 내용을 모두 입력해주세요.");
            return;
        }

        const reviewData = {
            email: userEmail,
            rating: parseFloat(rating),
            content: content
        };

        try {
            const response = await fetch(`/api/movies/${movieId}/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reviewData),
            });

            if (!response.ok) {
                throw new Error('Failed to submit review');
            }

            // 리뷰 등록 성공 후, 폼 초기화 및 리뷰 목록 다시 불러오기
            alert("리뷰가 성공적으로 등록되었습니다.");
            setUserEmail('');
            setRating(0);
            setContent('');
            fetchMovieData(); // 리뷰 목록을 새로고침하여 방금 등록한 리뷰를 포함시킴

        } catch (error) {
            console.error("Error submitting review:", error);
            alert("리뷰 등록에 실패했습니다.");
        }
    };


    if (loading) {
        return <div>로딩 중...</div>;
    }

    if (!movie) {
        return <div>영화 정보를 찾을 수 없습니다.</div>;
    }

    return (
        <div style={{padding: '20px'}}>
            {/* 영화 상세 정보 */}
            <h1>{movie.movieTitle}</h1>
            <div style={{display: 'flex', marginBottom: '40px'}}>
                <img src={movie.posterUrl} alt={movie.movieTitle} style={{width: '300px', marginRight: '20px'}}/>
                <div>
                    <p><strong>개봉일:</strong> {movie.releaseDate}</p>
                    <p><strong>평점:</strong> {movie.voteAverage}</p>
                    <h2>줄거리</h2>
                    <p>{movie.overview}</p>
                </div>
            </div>

            <hr/>

            {/* 리뷰 작성 폼 */}
            <div style={{marginBottom: '40px'}}>
                <h2>리뷰 작성하기</h2>
                <form onSubmit={handleReviewSubmit}>
                    <div style={{marginBottom: '10px'}}>
                        <label>이메일: </label>
                        <input
                            type="email"
                            value={userEmail}
                            onChange={(e) => setUserEmail(e.target.value)}
                            placeholder="user@example.com"
                            required
                        />
                    </div>
                    <div style={{marginBottom: '10px'}}>
                        <label>평점: </label>
                        <input
                            type="number"
                            step="0.5"
                            min="0.5"
                            max="5"
                            value={rating}
                            onChange={(e) => setRating(e.target.value)}
                            required
                        />
                    </div>
                    <div style={{marginBottom: '10px'}}>
                        <textarea
                            style={{width: '100%', minHeight: '80px'}}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="리뷰 내용을 작성해주세요."
                            required
                        >
                        </textarea>
                    </div>
                    <button type="submit">리뷰 등록</button>
                </form>
            </div>

            <hr/>

            {/* 리뷰 목록 */}
            <div>
                <h2>리뷰 목록</h2>
                {reviews.length > 0 ? (
                    reviews.map(review => (
                        <div key={review.reviewId} style={{border: '1px solid #ccc', padding: '10px', marginBottom: '10px'}}>
                            <p><strong>작성자:</strong> {review.nickname}</p>
                            <p><strong>평점:</strong> {review.rating}</p>
                            <p>{review.content}</p>
                        </div>
                    ))
                ) : (
                    <p>작성된 리뷰가 없습니다.</p>
                )}
            </div>
        </div>
    );
}

export default DetailPage;