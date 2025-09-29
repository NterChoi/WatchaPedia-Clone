import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function UserProfilePage() {
    const { userId } = useParams(); // URL에서 사용자 ID를 가져옵니다.
    const navigate = useNavigate();

    const [loggedInUser, setLoggedInUser] = useState(null); // 현재 로그인한 사용자
    const [profileUser, setProfileUser] = useState(null); // 프로필 페이지의 주인
    const [followCounts, setFollowCounts] = useState({ followerCount: 0, followingCount: 0 });
    const [isFollowing, setIsFollowing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [view, setView] = useState(null); // 'followers' 또는 'following'

    // 데이터 가져오는 함수
    const fetchData = async () => {
        setLoading(true); // 데이터 다시 가져올 때 로딩 상태로 설정
        try {
            // 1. 로그인한 사용자 정보 가져오기
            const meRes = await fetch('/api/me');
            const meData = meRes.ok ? await meRes.json() : null;
            setLoggedInUser(meData);

            // 2. 프로필 페이지의 사용자 정보, 팔로우 수, 팔로우 상태, 팔로워/팔로잉 리스트를 동시에 가져오기
            const [profileRes, countsRes, isFollowingRes, followersRes, followingRes] = await Promise.all([
                fetch(`/api/user/${userId}`),
                fetch(`/api/users/${userId}/follow-counts`),
                fetch(`/api/users/${userId}/is-following`),
                fetch(`/api/users/${userId}/followers`),
                fetch(`/api/users/${userId}/following`)
            ]);

            if (!profileRes.ok) throw new Error("사용자를 찾을 수 없습니다.");

            const profileData = await profileRes.json();
            const countsData = await countsRes.json();
            const isFollowingData = await isFollowingRes.json();
            const followersData = await followersRes.json();
            const followingData = await followingRes.json();


            setProfileUser(profileData);
            setFollowCounts(countsData);
            setIsFollowing(isFollowingData.isFollowing);
            setFollowers(followersData);
            setFollowing(followingData);
            setView(null); // userId 변경 시 목록 숨기기

        } catch (error) {
            console.error("데이터를 가져오는 중 오류 발생:", error);
            alert(error.message);
            navigate('/'); // 에러 발생 시 홈으로 이동
        } finally {
            setLoading(false);
        }
    };

    // 컴포넌트가 마운트되거나 userId가 변경될 때 데이터 가져오기
    useEffect(() => {
        fetchData();
    }, [userId]);

    // 팔로우 처리
    const handleFollow = async () => {
        try {
            const response = await fetch(`/api/follow/${userId}`, { method: 'POST' });
            if (response.ok) {
                // UI 즉시 업데이트
                setIsFollowing(true);
                setFollowCounts(prev => ({ ...prev, followerCount: prev.followerCount + 1 }));
                fetchData(); // 팔로우 후 전체 데이터 다시 로드
            } else {
                throw new Error('팔로우 실패');
            }
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };

    // 언팔로우 처리
    const handleUnfollow = async () => {
        try {
            const response = await fetch(`/api/unfollow/${userId}`, { method: 'DELETE' });
            if (response.ok) {
                // UI 즉시 업데이트
                setIsFollowing(false);
                setFollowCounts(prev => ({ ...prev, followerCount: prev.followerCount - 1 }));
                fetchData(); // 언팔로우 후 전체 데이터 다시 로드
            } else {
                throw new Error('언팔로우 실패');
            }
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };

    const handleUserClick = (id) => {
        navigate(`/user/${id}`);
    };


    if (loading) {
        return <div>로딩 중...</div>;
    }

    if (!profileUser) {
        return <div>사용자 정보를 불러올 수 없습니다.</div>;
    }

    // 본인 프로필인지 확인
    const isMyProfile = loggedInUser && loggedInUser.id === profileUser.id;

    return (
        <div style={{ padding: '40px' }}>
            <h1>{profileUser.nickname}님의 프로필</h1>
            <div style={{ margin: '20px 0' }}>
                <button onClick={() => setView('followers')} style={{ all: 'unset', cursor: 'pointer' }}>
                    팔로워: {followCounts.followerCount}
                </button>
                <button onClick={() => setView('following')} style={{ all: 'unset', cursor: 'pointer', marginLeft: '20px' }}>
                    팔로잉: {followCounts.followingCount}
                </button>
            </div>

            {/* 본인 프로필이 아닐 때만 팔로우/언팔로우 버튼 표시 */}
            {!isMyProfile && loggedInUser && (
                isFollowing ? (
                    <button onClick={handleUnfollow}>언팔로우</button>
                ) : (
                    <button onClick={handleFollow}>팔로우</button>
                )
            )}

            {/* 팔로워 또는 팔로잉 리스트 표시 */}
            {view === 'followers' && (
                <div>
                    <h2>팔로워</h2>
                    {followers.length > 0 ? (
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {followers.map(user => (
                                <li key={user.userId} onClick={() => handleUserClick(user.userId)} style={{ cursor: 'pointer', padding: '5px 0' }}>
                                    {user.nickname}
                                </li>
                            ))}
                        </ul>
                    ) : <p>팔로워가 없습니다.</p>}
                </div>
            )}

            {view === 'following' && (
                <div>
                    <h2>팔로잉</h2>
                    {following.length > 0 ? (
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {following.map(user => (
                                <li key={user.userId} onClick={() => handleUserClick(user.userId)} style={{ cursor: 'pointer', padding: '5px 0' }}>
                                    {user.nickname}
                                </li>
                            ))}
                        </ul>
                    ) : <p>팔로잉하는 사용자가 없습니다.</p>}
                </div>
            )}
        </div>
    );
}

export default UserProfilePage;
