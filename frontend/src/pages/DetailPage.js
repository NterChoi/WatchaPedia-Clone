import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; // Link를 import 합니다.

// 별점 UI 컴포넌트 (기존과 동일)
const StarRating = ({ rating, onRatingChange, readOnly = false }) => {
    const [hoverRating, setHoverRating] = useState(0);
    const stars = [1, 2, 3, 4, 5];

    return (
        <div>
            {stars.map((star) => (
                <span
                    key={star}
                    style={{
                        cursor: readOnly ? 'default' : 'pointer',
                        color: (hoverRating || rating) >= star ? 'gold' : 'gray',
                        fontSize: '28px',
                        marginRight: '2px',
                    }}
                    onMouseEnter={() => !readOnly && setHoverRating(star)}
                    onMouseLeave={() => !readOnly && setHoverRating(0)}
                    onClick={() => !readOnly && onRatingChange(star)}
                >
                    ★
                </span>
            ))}
        </div>
    );
};


function DetailPage() {
    const { movieId } = useParams();
    const [movie, setMovie] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);

    const [rating, setRating] = useState(0);
    const [content, setContent] = useState('');

    const [editingReviewId, setEditingReviewId] = useState(null);
    const [editedRating, setEditedRating] = useState(0);
    const [editedContent, setEditedContent] = useState('');

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const res = await fetch('/api/me');
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
            const movieResponse = await fetch(`/api/movies/tmdb/${movieId}`);
            if (!movieResponse.ok) throw new Error('Movie not found');
            const movieData = await movieResponse.json();
            setMovie(movieData);

            const reviewsResponse = await fetch(`/api/movies/${movieId}/reviews`);
            if (!reviewsResponse.ok) console.error('Failed to fetch reviews');
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
                fetchMovieData();

            } catch (error) {
                console.error("Error deleting review:", error);
                alert("리뷰 삭제에 실패했습니다.");
            }
        }
    };

    const handleEditClick = (review) => {
        setEditingReviewId(review.reviewId);
        setEditedRating(review.rating);
        setEditedContent(review.content);
    };

    const handleCancelEdit = () => {
        setEditingReviewId(null);
    };

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
            setEditingReviewId(null);
            fetchMovieData();

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
        <div style={{ padding: '20px' }}>
            <h1>{movie.title}</h1>
            <div style={{ display: 'flex', marginBottom: '40px' }}>
                {movie.poster_path ? (
                    <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} style={{ width: '300px', marginRight: '20px' }} />
                ) : (
                    <div style={{
                        width: '300px',
                        height: '450px',
                        backgroundColor: '#f0f0f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '20px',
                        color: '#aaa'
                    }}>
                        이미지 없음
                    </div>
                )}
                <div>
                    <p><strong>개봉일:</strong> {movie.release_date}</p>
                    <p><strong>평점:</strong> {movie.vote_average}</p>
                    <h2>줄거리</h2>
                    <p>{movie.overview}</p>
                </div>
            </div>

            <hr />

            {currentUser && (
                <div style={{ marginBottom: '40px' }}>
                    <h2>리뷰 작성하기</h2>
                    <form onSubmit={handleReviewSubmit}>
                        <div style={{ marginBottom: '10px' }}>
                            <label style={{ display: 'block', marginBottom: '5px' }}>평점: </label>
                            <StarRating rating={rating} onRatingChange={setRating} />
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <textarea
                                style={{ width: '100%', minHeight: '80px', marginTop: '10px' }}
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

            <hr />

            <div>
                <h2>리뷰 목록</h2>
                {reviews.length > 0 ? (
                    reviews.map(review => (
                        <div key={review.reviewId} style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '10px', borderRadius: '5px' }}>
                            {editingReviewId === review.reviewId ? (
                                <div>
                                    <p style={{ fontWeight: 'bold' }}>{review.nickname}</p>
                                    <div style={{ margin: '10px 0' }}>
                                        <StarRating rating={editedRating} onRatingChange={setEditedRating} />
                                    </div>
                                    <textarea
                                        style={{ width: '100%', minHeight: '80px' }}
                                        value={editedContent}
                                        onChange={(e) => setEditedContent(e.target.value)}
                                    />
                                    <div style={{ marginTop: '10px' }}>
                                        <button style={{ marginRight: '5px' }} onClick={() => handleUpdateSubmit(review.reviewId)}>저장</button>
                                        <button onClick={handleCancelEdit}>취소</button>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <Link to={`/user/${review.userId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <p style={{ fontWeight: 'bold' }}>{review.nickname}</p>
                                    </Link>
                                    <div style={{ margin: '5px 0' }}>
                                        <StarRating rating={review.rating} readOnly={true} />
                                    </div>
                                    <p style={{ marginTop: '10px' }}>{review.content}</p>
                                    {currentUser && currentUser.email === review.email && (
                                        <div style={{ marginTop: '10px' }}>
                                            <button style={{ marginRight: '5px' }} onClick={() => handleEditClick(review)}>수정</button>
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