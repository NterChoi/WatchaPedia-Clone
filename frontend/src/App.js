import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';

// 페이지 컴포넌트들을 가져옵니다.
import HomePage from './pages/HomePage';
import DetailPage from './pages/DetailPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import SearchPage from './pages/SearchPage';
import UserProfilePage from './pages/UserProfilePage'; // 프로필 페이지 import

import './App.css';

function App() {
    const [currentUser, setCurrentUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    // 로그인 사용자 정보 가져오기
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

    // 로그아웃 처리 함수
    const handleLogout = async () => {
        try {
            const response = await fetch('/logout', { method: 'POST' });
            if (response.ok) {
                alert('로그아웃 되었습니다.');
                setCurrentUser(null);
                navigate('/');
            } else {
                throw new Error('Logout failed');
            }
        } catch (error) {
            console.error("Logout error:", error);
            alert('로그아웃에 실패했습니다.');
        }
    };

    // 검색 실행 함수
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) {
            alert('검색어를 입력해주세요.');
            return;
        }
        navigate(`/search?query=${searchQuery}`);
    };

    return (
        <div className="App">
            <nav style={{ padding: '20px', backgroundColor: '#20232a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {/* 좌측 메뉴 (홈 버튼) */}
                <div>
                    <Link to="/" style={{ color: 'white', textDecoration: 'none', marginRight: '20px', fontSize: '18px' }}>
                        홈
                    </Link>
                </div>

                {/* 중앙 검색창 */}
                <div style={{ flexGrow: 1, maxWidth: '400px' }}>
                    <form onSubmit={handleSearchSubmit} style={{ display: 'flex' }}>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="영화 제목을 검색해보세요"
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: 'none' }}
                        />
                        <button type="submit" style={{ padding: '8px 12px', marginLeft: '5px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}>
                            검색
                        </button>
                    </form>
                </div>

                {/* 우측 메뉴 (로그인/회원가입 또는 사용자 정보) */}
                <div>
                    {currentUser ? (
                        <>
                            <span style={{ color: 'white', marginRight: '20px' }}>{currentUser.nickname}님 환영합니다!</span>
                            <button onClick={handleLogout} style={{ color: 'white', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}>
                                로그아웃
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" style={{ color: 'white', textDecoration: 'none', marginRight: '20px', fontSize: '18px' }}>
                                로그인
                            </Link>
                            <Link to="/signup" style={{ color: 'white', textDecoration: 'none', fontSize: '18px' }}>
                                회원가입
                            </Link>
                        </>
                    )}
                </div>
            </nav>

            <main>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/movie/:movieId" element={<DetailPage />} />
                    <Route path="/login" element={<LoginPage setCurrentUser={setCurrentUser} />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/search" element={<SearchPage />} />
                    {/* 사용자 프로필 페이지 라우트 추가 */}
                    <Route path="/user/:userId" element={<UserProfilePage />} />
                </Routes>
            </main>
        </div>
    );
}

export default App;
