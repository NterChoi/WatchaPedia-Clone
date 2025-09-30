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
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);

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

    // 파일 선택 시 호출될 핸들러
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            // 파일 미리보기 생성
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // 이미지 업로드 핸들러
    const handleImageUpload = async () => {
        if (!selectedFile) {
            alert("파일을 선택해주세요.");
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            const response = await fetch(`/api/user/${userId}/profile-image`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                alert("프로필 이미지가 변경되었습니다.");
                // 상태 초기화 및 데이터 다시 로드
                setSelectedFile(null);
                setPreview(null);
                fetchData(); // 프로필 정보를 다시 불러와 새 이미지 표시
            } else {
                const errorData = await response.json();
                throw new Error(errorData.msg || "이미지 업로드에 실패했습니다.");
            }
        } catch (error) {
            console.error("이미지 업로드 오류:", error);
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
    const isMyProfile = loggedInUser && loggedInUser.id === profileUser.id;

    return (
        <div style={{ padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* 프로필 이미지 */}
            <div style={{ marginBottom: '20px' }}>
                <img
                    src={preview || profileUser.profileImg || '/images/default_profile.png'}
                    alt={`${profileUser.nickname}의 프로필`}
                    style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover' }}
                />
            </div>

            {/* 닉네임 */}
            <h1 style={{ textAlign: 'center' }}>{profileUser.nickname}님의 프로필</h1>

            {/* 팔로우/팔로잉 정보 */}
            <div style={{ margin: '20px 0' }}>
                <button onClick={() => setView('followers')} style={{ all: 'unset', cursor: 'pointer' }}>
                    팔로워: {followCounts.followerCount}
                </button>
                <button onClick={() => setView('following')} style={{ all: 'unset', cursor: 'pointer', marginLeft: '20px' }}>
                    팔로잉: {followCounts.followingCount}
                </button>
            </div>

            {/* 이미지 수정 UI (본인 프로필일 때만) */}
            {isMyProfile && (
                <div style={{ margin: '20px 0', border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
                    <label htmlFor="profile-upload" style={{ cursor: 'pointer', padding: '8px 12px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
                        이미지 선택
                    </label>
                    <input
                        id="profile-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                    />
                    {selectedFile && <span style={{ marginLeft: '10px' }}>{selectedFile.name}</span>}
                    {preview && <button onClick={handleImageUpload} style={{ marginLeft: '10px' }}>이미지 변경</button>}
                </div>
            )}

            {/* 팔로우/언팔로우 버튼 (타인 프로필일 때만) */}
            {!isMyProfile && loggedInUser && (
                isFollowing ? (
                    <button onClick={handleUnfollow}>언팔로우</button>
                ) : (
                    <button onClick={handleFollow}>팔로우</button>
                )
            )}

            {/* 팔로워/팔로잉 리스트 */}
            {view && (
                <div style={{ width: '100%', maxWidth: '300px', marginTop: '20px' }}>
                    <h2>{view === 'followers' ? '팔로워' : '팔로잉'}</h2>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {(view === 'followers' ? followers : following).length > 0 ? (
                            (view === 'followers' ? followers : following).map(user => (
                                <li key={user.userId} onClick={() => handleUserClick(user.userId)} style={{ cursor: 'pointer', padding: '8px 0', borderBottom: '1px solid #eee' }}>
                                    <img src={user.profileImg || '/images/default_profile.png'} alt={user.nickname} style={{ width: '30px', height: '30px', borderRadius: '50%', marginRight: '10px' }} />
                                    {user.nickname}
                                </li>
                            ))
                        ) : <p>{view === 'followers' ? '팔로워가 없습니다.' : '팔로잉하는 사용자가 없습니다.'}</p>}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default UserProfilePage;
