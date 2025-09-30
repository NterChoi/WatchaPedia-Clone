import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // react-calendar의 기본 CSS

// Date 객체를 'YYYY-MM-DD' 형식의 문자열로 변환하는 헬퍼 함수
const formatDate = (date) => {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
};

function UserProfilePage() {
    const { userId } = useParams();
    const navigate = useNavigate();

    // 기본 state
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [profileUser, setProfileUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState(null); // 'followers', 'following', 'ratings', 'calendar'

    // 프로필 이미지 state
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);

    // 팔로우 state
    const [followCounts, setFollowCounts] = useState({ followerCount: 0, followingCount: 0 });
    const [isFollowing, setIsFollowing] = useState(false);
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);

    // 평가한 영화 state
    const [ratedMovies, setRatedMovies] = useState([]);

    // 달력 state
    const [calendarData, setCalendarData] = useState({});
    const [selectedDate, setSelectedDate] = useState(new Date());

    // 데이터 가져오는 함수
    const fetchData = async () => {
        setLoading(true);
        try {
            const [profileRes, countsRes, isFollowingRes, followersRes, followingRes, ratedMoviesRes, calendarRes] = await Promise.all([
                fetch(`/api/user/${userId}`),
                fetch(`/api/users/${userId}/follow-counts`),
                fetch(`/api/users/${userId}/is-following`),
                fetch(`/api/users/${userId}/followers`),
                fetch(`/api/users/${userId}/following`),
                fetch(`/api/user/${userId}/reviews`),
                fetch(`/api/user/${userId}/ratings-calendar`) // 달력 데이터 API 호출 추가
            ]);

            if (!profileRes.ok) throw new Error("사용자를 찾을 수 없습니다.");

            // 모든 응답을 JSON으로 변환
            const [profileData, countsData, isFollowingData, followersData, followingData, ratedMoviesData, calendarData] = await Promise.all([
                profileRes.json(),
                countsRes.json(),
                isFollowingRes.json(),
                followersRes.json(),
                followingRes.json(),
                ratedMoviesRes.json(),
                calendarRes.json()
            ]);

            // State 업데이트
            setProfileUser(profileData);
            setFollowCounts(countsData);
            setIsFollowing(isFollowingData.isFollowing);
            setFollowers(followersData);
            setFollowing(followingData);
            setRatedMovies(ratedMoviesData);
            setCalendarData(calendarData);
            setView(null);

        } catch (error) {
            console.error("데이터를 가져오는 중 오류 발생:", error);
            alert(error.message);
            navigate('/');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [userId]);

    // (handleFollow, handleUnfollow, handleUserClick, handleFileChange, handleImageUpload 함수들은 이전과 동일)
    const handleFollow = async () => { try { const response = await fetch(`/api/follow/${userId}`, { method: 'POST' }); if (response.ok) fetchData(); else throw new Error('팔로우 실패'); } catch (error) { console.error(error); alert(error.message); } };
    const handleUnfollow = async () => { try { const response = await fetch(`/api/unfollow/${userId}`, { method: 'DELETE' }); if (response.ok) fetchData(); else throw new Error('언팔로우 실패'); } catch (error) { console.error(error); alert(error.message); } };
    const handleUserClick = (id) => navigate(`/user/${id}`);
    const handleFileChange = (e) => { const file = e.target.files[0]; if (file) { setSelectedFile(file); const reader = new FileReader(); reader.onloadend = () => setPreview(reader.result); reader.readAsDataURL(file); } };
    const handleImageUpload = async () => { if (!selectedFile) { alert("파일을 선택해주세요."); return; } const formData = new FormData(); formData.append("file", selectedFile); try { const response = await fetch(`/api/user/${userId}/profile-image`, { method: 'POST', body: formData }); if (response.ok) { alert("프로필 이미지가 변경되었습니다."); setSelectedFile(null); setPreview(null); fetchData(); } else { const errorData = await response.json(); throw new Error(errorData.msg || "이미지 업로드에 실패했습니다."); } } catch (error) { console.error("이미지 업로드 오류:", error); alert(error.message); } };

    if (loading) return <div>로딩 중...</div>;
    if (!profileUser) return <div>사용자 정보를 불러올 수 없습니다.</div>;

    const isMyProfile = loggedInUser && loggedInUser.id === profileUser.id;

    // 선택된 날짜에 해당하는 리뷰 목록
    const moviesOnSelectedDate = calendarData[formatDate(selectedDate)] || [];

    return (
        <>
            {/* 달력의 점 스타일 */}
            <style>{`.rating-dot { height: 8px; width: 8px; background-color: #f5c518; border-radius: 50%; display: block; margin: 2px auto 0; }`}</style>
            <div style={{ padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ marginBottom: '20px' }}>
                    <img src={preview || (profileUser && profileUser.profileImg) || '/images/default_profile.png'} alt={`${profileUser ? profileUser.nickname : ''}의 프로필`} style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover' }} />
                </div>
                <h1 style={{ textAlign: 'center' }}>{profileUser.nickname}님의 프로필</h1>

                {/* 탭 버튼 */}
                <div style={{ margin: '20px 0', display: 'flex', gap: '20px' }}>
                    <button onClick={() => setView('followers')} style={{ all: 'unset', cursor: 'pointer' }}>팔로워: {followCounts.followerCount}</button>
                    <button onClick={() => setView('following')} style={{ all: 'unset', cursor: 'pointer' }}>팔로잉: {followCounts.followingCount}</button>
                    <button onClick={() => setView('ratings')} style={{ all: 'unset', cursor: 'pointer' }}>평가한 영화: {ratedMovies.length}</button>
                    <button onClick={() => setView('calendar')} style={{ all: 'unset', cursor: 'pointer' }}>평가 달력</button>
                </div>

                {/* 이미지 수정 UI */}
                {isMyProfile && <div style={{ margin: '20px 0', border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}><label htmlFor="profile-upload" style={{ cursor: 'pointer', padding: '8px 12px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>이미지 선택</label><input id="profile-upload" type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />{selectedFile && <span style={{ marginLeft: '10px' }}>{selectedFile.name}</span>}{preview && <button onClick={handleImageUpload} style={{ marginLeft: '10px' }}>이미지 변경</button>}</div>}

                {/* 팔로우/언팔로우 버튼 */}
                {!isMyProfile && loggedInUser && (isFollowing ? <button onClick={handleUnfollow}>언팔로우</button> : <button onClick={handleFollow}>팔로우</button>)}

                {/* 동적 컨텐츠 영역 */}
                <div style={{ width: '100%', maxWidth: '800px', marginTop: '20px' }}>
                    {view === 'followers' && <div><h2>팔로워</h2><ul style={{ listStyle: 'none', padding: 0 }}>{followers.map(user => <li key={user.userId} onClick={() => handleUserClick(user.userId)} style={{ cursor: 'pointer', padding: '8px 0', borderBottom: '1px solid #eee' }}><img src={user.profileImg || '/images/default_profile.png'} alt={user.nickname} style={{ width: '30px', height: '30px', borderRadius: '50%', marginRight: '10px' }} />{user.nickname}</li>)}</ul></div>}
                    {view === 'following' && <div><h2>팔로잉</h2><ul style={{ listStyle: 'none', padding: 0 }}>{following.map(user => <li key={user.userId} onClick={() => handleUserClick(user.userId)} style={{ cursor: 'pointer', padding: '8px 0', borderBottom: '1px solid #eee' }}><img src={user.profileImg || '/images/default_profile.png'} alt={user.nickname} style={{ width: '30px', height: '30px', borderRadius: '50%', marginRight: '10px' }} />{user.nickname}</li>)}</ul></div>}
                    {view === 'ratings' && <div><h2>평가한 영화</h2><div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>{ratedMovies.length > 0 ? ratedMovies.map(review => <div key={review.reviewId} style={{ margin: '10px', width: '180px', textAlign: 'center' }}><Link to={`/movie/${review.movieId}`}><img src={`https://image.tmdb.org/t/p/w500${review.posterPath}`} alt={review.title} style={{ width: '100%', borderRadius: '8px' }} /></Link><h4 style={{ marginTop: '8px', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{review.title}</h4><p style={{ margin: 0, color: '#f5c518' }}>★ {review.rating.toFixed(1)}</p></div>) : <p>평가한 영화가 없습니다.</p>}</div></div>}
                    {view === 'calendar' && (
                        <div>
                            <h2>평가 달력</h2>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                                <Calendar
                                    onChange={setSelectedDate}
                                    value={selectedDate}
                                    tileContent={({ date, view }) => view === 'month' && calendarData[formatDate(date)] ? <span className="rating-dot"></span> : null}
                                />
                                <div style={{ width: '400px' }}>
                                    <h3>{formatDate(selectedDate)} 평가 목록</h3>
                                    {moviesOnSelectedDate.length > 0 ? (
                                        moviesOnSelectedDate.map(review => (
                                            <div key={review.reviewId} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                                <Link to={`/movie/${review.movieId}`}><img src={`https://image.tmdb.org/t/p/w200${review.posterPath}`} alt={review.title} style={{ width: '60px', marginRight: '10px' }} /></Link>
                                                <div>
                                                    <p style={{ margin: 0, fontWeight: 'bold' }}>{review.title}</p>
                                                    <p style={{ margin: 0, color: '#f5c518' }}>★ {review.rating.toFixed(1)}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : <p>해당 날짜에 평가한 영화가 없습니다.</p>}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default UserProfilePage;
