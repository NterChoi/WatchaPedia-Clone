import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

// 별점 입력/표시 UI 컴포넌트
const StarRating = ({ rating, onRatingChange, readOnly = false, size = 28 }) => {
    const [hoverRating, setHoverRating] = useState(0);
    const stars = [1, 2, 3, 4, 5];

    return (
        <div>
            {stars.map((star) => (
                <span
                    key={star}
                    style={{
                        cursor: readOnly ? 'default' : 'pointer',
                        color: (hoverRating || rating) >= star ? '#FACC15' : '#E5E7EB',
                        fontSize: `${size}px`,
                        marginRight: '2px',
                        transition: 'color 0.2s'
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

    // 리뷰 작성을 위한 상태
    const [myRating, setMyRating] = useState(0);
    const [myContent, setMyContent] = useState('');

    // 수정 모드를 위한 상태
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchInitialData = async () => {
            setLoading(true);
            try {
                // 유저 정보, 영화 상세 정보, 리뷰 목록을 동시에 가져옴
                const [userRes, movieRes, reviewsRes] = await Promise.all([
                    fetch('/api/me'),
                    fetch(`/api/movies/tmdb/${movieId}`),
                    fetch(`/api/movies/${movieId}/reviews`)
                ]);

                // 유저 정보 설정
                if (userRes.ok) {
                    const userData = await userRes.json();
                    setCurrentUser(userData);
                } else {
                    setCurrentUser(null);
                }

                // 영화 정보 설정
                if (!movieRes.ok) throw new Error('Movie not found');
                const movieData = await movieRes.json();
                setMovie(movieData);

                // 리뷰 목록 설정
                if (!reviewsRes.ok) throw new Error('Failed to fetch reviews');
                const reviewsData = await reviewsRes.json();
                setReviews(reviewsData);

            } catch (error) {
                console.error("Failed to fetch initial data: ", error);
                setMovie(null);
                setReviews([]);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, [movieId]);

    // 내 리뷰 정보가 업데이트될 때마다 별점/내용 상태를 업데이트
    const myReview = currentUser ? reviews.find(r => r.email === currentUser.email) : null;
    useEffect(() => {
        if (myReview) {
            setMyRating(myReview.rating);
            setMyContent(myReview.content);
        } else {
            setMyRating(0);
            setMyContent('');
        }
    }, [reviews, currentUser]); // reviews나 currentUser가 바뀔 때마다 실행


    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (myRating === 0) {
            alert("평점을 입력해주세요.");
            return;
        }
        
        const reviewData = { rating: parseFloat(myRating), content: myContent };
        const url = isEditing ? `/api/reviews/${myReview.reviewId}` : `/api/reviews?tmdbId=${movieId}`;
        const method = isEditing ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reviewData),
            });

            if (!response.ok) throw new Error('Server error');
            
            alert(`리뷰가 성공적으로 ${isEditing ? '수정' : '등록'}되었습니다.`);
            setIsEditing(false);
            // 리뷰 목록을 다시 불러와 화면을 갱신
            const reviewsRes = await fetch(`/api/movies/${movieId}/reviews`);
            const reviewsData = await reviewsRes.json();
            setReviews(reviewsData);

        } catch (error) {
            alert(`리뷰 ${isEditing ? '수정' : '등록'}에 실패했습니다.`);
        }
    };

    const handleDelete = async () => {
        if (myReview && window.confirm("정말로 이 리뷰를 삭제하시겠습니까?")) {
            try {
                const response = await fetch(`/api/reviews/${myReview.reviewId}`, { method: 'DELETE' });
                if (!response.ok) throw new Error('Failed to delete review');
                alert("리뷰가 삭제되었습니다.");
                // 리뷰 상태 초기화 및 목록 다시 불러오기
                setMyRating(0);
                setMyContent('');
                const reviewsRes = await fetch(`/api/movies/${movieId}/reviews`);
                const reviewsData = await reviewsRes.json();
                setReviews(reviewsData);
            } catch (error) {
                alert("리뷰 삭제에 실패했습니다.");
            }
        }
    };

    if (loading) {
        return <div style={styles.loadingContainer}>로딩 중...</div>;
    }

    if (!movie) {
        return <div style={styles.loadingContainer}>영화 정보를 찾을 수 없습니다.</div>;
    }

    const director = movie.credits?.crew.find(c => c.job === 'Director');
    const mainActors = movie.credits?.cast.slice(0, 10);
    const imagesToShow = (movie.images?.backdrops?.length > 0)
        ? movie.images.backdrops
        : movie.images?.posters || [];

    // 내가 평가한 영화인지 여부
    const isRatedByMe = !!myReview;

    // 상단에 표시될 별점 (내가 평가했으면 내 별점, 아니면 평균 별점)
    const ratingToShow = isRatedByMe ? myReview.rating : (movie.vote_average / 2);

    return (
        <div style={styles.pageContainer}>
            {/* --- 상단 배너 섹션 --- */}
            <div style={styles.bannerContainer}>
                <div style={{ ...styles.bannerBackdrop, backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})` }}></div>
                <div style={styles.bannerOverlay}></div>
                <div style={styles.bannerContent}>
                    <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} style={styles.poster} />
                    <div style={styles.infoContainer}>
                        <h1 style={styles.title}>{movie.title}</h1>
                        <p style={styles.metaInfo}>
                            {movie.release_date?.substring(0, 4)} ・ {movie.genres?.map(g => g.name).join('/')} ・ {movie.runtime}분
                        </p>
                        <div style={styles.ratingSectionTop}>
                            {isRatedByMe ? '내가 남긴 평점' : '평균 별점'}
                            <div style={styles.averageRating}>
                                <span style={{fontSize: '28px', marginRight: '10px'}}>★</span>
                                <span style={{fontSize: '32px', fontWeight: 'bold'}}>{ratingToShow.toFixed(1)}</span>
                            </div>
                        </div>
                        
                        {/* --- 리뷰/평가 UI --- */}
                        {currentUser && (
                            <div style={styles.myRatingSection}>
                                {isRatedByMe && !isEditing ? (
                                    // 평가 완료 상태
                                    <div>
                                        <p style={{color: '#FACC15', marginBottom: '10px'}}>내 평가</p>
                                        <StarRating rating={myRating} readOnly={true} size={32}/>
                                        {myReview.content && <p style={styles.myReviewContent}>"{myReview.content}"</p>}
                                        <div style={{marginTop: '15px'}}>
                                            <button onClick={() => setIsEditing(true)} style={styles.editButton}>수정</button>
                                            <button onClick={handleDelete} style={styles.deleteButton}>삭제</button>
                                        </div>
                                    </div>
                                ) : (
                                    // 평가/수정 상태
                                    <form onSubmit={handleReviewSubmit}>
                                        <p style={{color: '#FACC15', marginBottom: '10px'}}>{isEditing ? '평가 수정' : '이 영화를 평가해보세요'}</p>
                                        <StarRating rating={myRating} onRatingChange={setMyRating} size={32} />
                                        <textarea
                                            style={styles.reviewTextareaSmall}
                                            value={myContent}
                                            onChange={(e) => setMyContent(e.target.value)}
                                            placeholder="한줄평을 남겨보세요 (선택)"
                                        ></textarea>
                                        <div style={{marginTop: '15px', textAlign: 'right'}}>
                                            {isEditing && <button type="button" onClick={() => setIsEditing(false)} style={styles.cancelButton}>취소</button>}
                                            <button type="submit" style={styles.submitButton}>{isEditing ? '수정' : '등록'}</button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* --- 메인 콘텐츠 섹션 --- */}
            <div style={styles.mainContent}>
                 {/* 줄거리 */}
                 <section style={styles.section}>
                    <h2 style={styles.sectionTitle}>줄거리</h2>
                    <p style={styles.overview}>{movie.overview}</p>
                </section>

                {/* 감독 및 출연 */}
                <section style={styles.section}>
                    <h2 style={styles.sectionTitle}>감독/출연</h2>
                    <div style={styles.scrollContainer}>
                        {director && (
                            <div style={styles.personCard}>
                                <img src={director.profile_path ? `https://image.tmdb.org/t/p/w200${director.profile_path}` : '/images/default_profile.png'} alt={director.name} style={styles.personImage} />
                                <p style={styles.personName}>{director.name}</p>
                                <p style={styles.personRole}>감독</p>
                            </div>
                        )}
                        {mainActors?.map(person => (
                            <div key={person.id} style={styles.personCard}>
                                <img src={person.profile_path ? `https://image.tmdb.org/t/p/w200${person.profile_path}` : '/images/default_profile.png'} alt={person.name} style={styles.personImage} />
                                <p style={styles.personName}>{person.name}</p>
                                <p style={styles.personRole}>{person.character}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 주요 장면 */}
                <section style={styles.section}>
                    <h2 style={styles.sectionTitle}>주요 장면</h2>
                    <div style={styles.scrollContainer}>
                        {imagesToShow.map((image, index) => (
                            <img
                                key={index}
                                src={`https://image.tmdb.org/t/p/w500${image.file_path}`}
                                alt={`Backdrop ${index + 1}`}
                                style={styles.galleryImage}
                            />
                        ))}
                    </div>
                </section>

                {/* 리뷰 목록 */}
                <section style={styles.section}>
                    <h2 style={styles.sectionTitle}>리뷰 목록</h2>
                    <div>
                        {reviews.filter(r => r.email !== currentUser?.email).length > 0 ? (
                            reviews.filter(r => r.email !== currentUser?.email).map(review => (
                                <div key={review.reviewId} style={styles.reviewCard}>
                                    <div>
                                        <div style={{display: 'flex', alignItems: 'center', marginBottom: '10px'}}>
                                            <Link to={`/user/${review.userId}`} style={{textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center'}}>
                                                <img src={review.profile_path || '/images/default_profile.png'} alt={review.nickname} style={styles.reviewUserImage} />
                                                <span style={styles.reviewNickname}>{review.nickname}</span>
                                            </Link>
                                        </div>
                                        <StarRating rating={review.rating} readOnly={true} size={20} />
                                        <p style={styles.reviewContent}>{review.content}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>작성된 다른 리뷰가 없습니다.</p>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}

const styles = {
    pageContainer: { backgroundColor: '#141414', color: '#FFFFFF', minHeight: '100vh' },
    loadingContainer: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#FFFFFF', backgroundColor: '#141414' },
    bannerContainer: { position: 'relative', width: '100%', color: '#FFFFFF' },
    bannerBackdrop: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundSize: 'cover', backgroundPosition: 'center', filter: 'blur(8px)', transform: 'scale(1.1)' },
    bannerOverlay: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to top, #141414 20%, rgba(20, 20, 20, 0.7) 60%, #141414 100%)' },
    bannerContent: { position: 'relative', display: 'flex', maxWidth: '1200px', margin: '0 auto', padding: '80px 40px', alignItems: 'flex-end' },
    poster: { width: '250px', height: '375px', borderRadius: '8px', boxShadow: '0 10px 20px rgba(0, 0, 0, 0.5)', flexShrink: 0 },
    infoContainer: { marginLeft: '40px', flexGrow: 1 },
    title: { fontSize: '48px', fontWeight: 'bold', marginBottom: '10px' },
    metaInfo: { fontSize: '16px', color: '#A0A0A0', marginBottom: '20px' },
    ratingSectionTop: { marginBottom: '30px' },
    averageRating: { display: 'flex', alignItems: 'center', color: '#E5E7EB', marginTop: '10px' },
    myRatingSection: { backgroundColor: 'rgba(0, 0, 0, 0.3)', padding: '20px', borderRadius: '8px' },
    myReviewContent: { fontStyle: 'italic', marginTop: '10px', color: '#D1D5DB' },
    mainContent: { maxWidth: '1200px', margin: '0 auto', padding: '40px' },
    section: { marginBottom: '50px' },
    sectionTitle: { fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', borderLeft: '4px solid #E50914', paddingLeft: '10px' },
    overview: { fontSize: '16px', lineHeight: '1.7', color: '#D1D5DB' },
    scrollContainer: { display: 'flex', overflowX: 'auto', gap: '20px', paddingBottom: '15px' },
    personCard: { textAlign: 'center', flexShrink: 0, width: '140px' },
    personImage: { width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', marginBottom: '10px', backgroundColor: '#333' },
    personName: { fontSize: '16px', fontWeight: 'bold' },
    personRole: { fontSize: '14px', color: '#A0A0A0' },
    galleryImage: { height: '180px', borderRadius: '8px', cursor: 'pointer', transition: 'transform 0.2s' },
    reviewTextareaSmall: { width: '100%', minHeight: '60px', backgroundColor: '#333', border: '1px solid #555', borderRadius: '4px', color: '#FFF', padding: '10px', fontSize: '14px', marginTop: '15px' },
    submitButton: { backgroundColor: '#E50914', color: '#FFF', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
    cancelButton: { backgroundColor: '#555', color: '#FFF', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', marginRight: '10px' },
    reviewCard: { backgroundColor: '#1F1F1F', padding: '20px', borderRadius: '8px', marginBottom: '15px' },
    reviewUserImage: { width: '40px', height: '40px', borderRadius: '50%', marginRight: '15px' },
    reviewNickname: { fontWeight: 'bold', fontSize: '18px' },
    reviewContent: { marginTop: '10px', lineHeight: '1.6' },
    editButton: { backgroundColor: 'transparent', color: '#A0A0A0', border: 'none', cursor: 'pointer', marginRight: '10px' },
    deleteButton: { backgroundColor: 'transparent', color: '#A0A0A0', border: 'none', cursor: 'pointer' }
};

export default DetailPage;