import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';

function DetailPage() {
    const {movieId} = useParams();
    const [movie, setMovie] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null); // 현재 사용자 정보

    // 리뷰 작성 폼 상태
    const [rating, setRating] = useState(0);
    const [content, setContent] = useState('');

    // 리뷰 수정 폼 상태
    const [editingReviewId, setEditingReviewId] = useState(null);
    const [editedRating, setEditedRating] = useState(0);
    const [editedContent, setEditedContent] = useState('');


    // 현재 로그인한 사용자 정보 가져오기
    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const res = await fetch('/api/user/me');
                if (res.ok) {
                    const userData = await res.json();
                    setCurrentUser(userData);
                } else {
                    setCurrentUser(null);
                }
            } catch (error) {
                console.error("Failed to fetch user data:", error);
                setCurrentUser(null);
            }
        };

        fetchCurrentUser();
    }, []);

    const fetchMovieData = async () => {
        try {
            setLoading(true);
            const movieResponse = await fetch(`/api/movies/${movieId}`);
            if (!movieResponse.ok) throw new Error('Movie not found');
            const movieData = await movieResponse.json();
            setMovie(movieData);

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

        if (rating === 0 || !content) {
            alert("평점, 리뷰 내용을 모두 입력해주세요.");
            return;
        }

        const reviewData = {
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

            alert("리뷰가 성공적으로 등록되었습니다.");
            setRating(0);
            setContent('');
            fetchMovieData();

        } catch (error) {
            console.error("Error submitting review:", error);
            alert("리뷰 등록에 실패했습니다.");
        }
    };

    const handleDelete = async (reviewId) => {
        if (window.confirm("정말로 이 리뷰를 삭제하시겠습니까?")) {
            try {
                const response = await fetch(`/api/reviews/${reviewId}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    throw new Error('Failed to delete review');
                }

                alert("리뷰가 삭제되었습니다.");
                fetchMovieData(); // 리뷰 목록 새로고침

            } catch (error) {
                console.error("Error deleting review:", error);
                alert("리뷰 삭제에 실패했습니다.");
            }
        }
    };

    // 수정 버튼 클릭 핸들러
    const handleEditClick = (review) => {
        setEditingReviewId(review.reviewId);
        setEditedRating(review.rating);
        setEditedContent(review.content);
    };

    // 수정 취소 버튼 핸들러
    const handleCancelEdit = () => {
        setEditingReviewId(null);
    };

    // 수정 저장 버튼 핸들러
    const handleUpdateSubmit = async (reviewId) => {
        const updatedReview = {
            rating: parseFloat(editedRating),
            content: editedContent,
        };

        try {
            const response = await fetch(`/api/reviews/${reviewId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedReview),
            });

            if (!response.ok) {
                throw new Error('Failed to update review');
            }

            alert("리뷰가 성공적으로 수정되었습니다.");
            setEditingReviewId(null); // 수정 모드 종료
            fetchMovieData(); // 목록 새로고침

        } catch (error) {
            console.error("Error updating review:", error);
            alert("리뷰 수정에 실패했습니다.");
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
            {currentUser && (
                <div style={{marginBottom: '40px'}}>
                    <h2>리뷰 작성하기</h2>
                    <form onSubmit={handleReviewSubmit}>
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
            )}

            <hr/>

            {/* 리뷰 목록 */}
            <div>
                <h2>리뷰 목록</h2>
                {reviews.length > 0 ? (
                    reviews.map(review => (
                        <div key={review.reviewId} style={{border: '1px solid #ccc', padding: '10px', marginBottom: '10px'}}>
                            {editingReviewId === review.reviewId ? (
                                // 수정 모드 UI
                                <div>
                                    <p><strong>작성자:</strong> {review.nickname}</p>
                                    <div style={{marginBottom: '10px'}}>
                                        <label>평점: </label>
                                        <input
                                            type="number" step="0.5" min="0.5" max="5"
                                            value={editedRating}
                                            onChange={(e) => setEditedRating(e.target.value)}
                                        />
                                    </div>
                                    <textarea
                                        style={{width: '100%', minHeight: '80px'}}
                                        value={editedContent}
                                        onChange={(e) => setEditedContent(e.target.value)}
                                    />
                                    <div style={{marginTop: '10px'}}>
                                        <button style={{marginRight: '5px'}} onClick={() => handleUpdateSubmit(review.reviewId)}>저장</button>
                                        <button onClick={handleCancelEdit}>취소</button>
                                    </div>
                                </div>
                            ) : (
                                // 일반 모드 UI
                                <div>
                                    <p><strong>작성자:</strong> {review.nickname}</p>
                                    <p><strong>평점:</strong> {review.rating}</p>
                                    <p>{review.content}</p>
                                    {currentUser && currentUser.email === review.email && (
                                        <div style={{marginTop: '10px'}}>
                                            <button style={{marginRight: '5px'}} onClick={() => handleEditClick(review)}>수정</button>
                                            <button onClick={() => handleDelete(review.reviewId)}>삭제</button>
                                        </div>
                                    )}
                                </div>
                            )}
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
