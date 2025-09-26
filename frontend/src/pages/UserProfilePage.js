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

    // 데이터 가져오는 함수
    const fetchData = async () => {
        try {
            // 1. 로그인한 사용자 정보 가져오기
            const meRes = await fetch('/api/me');
            const meData = meRes.ok ? await meRes.json() : null;
            setLoggedInUser(meData);

            // 2. 프로필 페이지의 사용자 정보, 팔로우 수, 팔로우 상태를 동시에 가져오기
            const [profileRes, countsRes, isFollowingRes] = await Promise.all([
                fetch(`/api/users/${userId}`),
                fetch(`/api/users/${userId}/follow-counts`),
                fetch(`/api/users/${userId}/is-following`)
            ]);

            if (!profileRes.ok) throw new Error("사용자를 찾을 수 없습니다.");

            const profileData = await profileRes.json();
            const countsData = await countsRes.json();
            const isFollowingData = await isFollowingRes.json();

            setProfileUser(profileData);
            setFollowCounts(countsData);
            setIsFollowing(isFollowingData.isFollowing);

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
            } else {
                throw new Error('언팔로우 실패');
            }
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };

    if (loading) {
        return <div>로딩 중...</div>;
    }

    if (!profileUser) {
        return <div>사용자 정보를 불러올 수 없습니다.</div>;
    }

    // 본인 프로필인지 확인
    const isMyProfile = loggedInUser && loggedInUser.email === profileUser.email;

    return (
        <div style={{ padding: '40px' }}>
            <h1>{profileUser.nickname}님의 프로필</h1>
            <div style={{ margin: '20px 0' }}>
                <span>팔로워: {followCounts.followerCount}</span>
                <span style={{ marginLeft: '20px' }}>팔로잉: {followCounts.followingCount}</span>
            </div>

            {/* 본인 프로필이 아닐 때만 팔로우/언팔로우 버튼 표시 */}
            {!isMyProfile && loggedInUser && (
                isFollowing ? (
                    <button onClick={handleUnfollow}>언팔로우</button>
                ) : (
                    <button onClick={handleFollow}>팔로우</button>
                )
            )}
        </div>
    );
}

export default UserProfilePage;
