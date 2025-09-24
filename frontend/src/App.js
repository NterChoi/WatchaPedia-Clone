  import React, { useState, useEffect } from 'react';
  import { Routes, Route, Link, useNavigate } from 'react-router-dom';

  // 각 페이지를 구성하는 컴포넌트들을 가져옵니다.
  import HomePage from './pages/HomePage';
  import DetailPage from './pages/DetailPage';
  import LoginPage from './pages/LoginPage';
  import SignupPage from './pages/SignupPage';

  // CSS 스타일을 적용하기 위해 App.css 파일을 가져옵니다.
  import './App.css';

  // App 컴포넌트는 우리 애플리케이션의 최상위 컴포넌트입니다.
  function App() {
      const [currentUser, setCurrentUser] = useState(null);
      const navigate = useNavigate();

      // 컴포넌트가 처음 렌더링될 때 로그인한 사용자 정보를 가져옵니다.
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
              const response = await fetch('/logout', {
                  method: 'POST',
              });

              if (response.ok) {
                  alert('로그아웃 되었습니다.');
                  setCurrentUser(null); // 사용자 상태 초기화
                  navigate('/'); // 홈페이지로 이동
              } else {
                  throw new Error('Logout failed');
              }
          } catch (error) {
              console.error("Logout error:", error);
              alert('로그아웃에 실패했습니다.');
          }
      };

      return (
          <div className="App">
              {/* 상단 네비게이션 메뉴 부분입니다. */}
              <nav style={{ padding: '20px', backgroundColor: '#20232a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                      <Link to="/" style={{ color: 'white', textDecoration: 'none', marginRight: '20px', fontSize: '18px' }}>
                          홈
                      </Link>
                  </div>
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

              {/* 페이지의 메인 콘텐츠가 표시될 부분입니다. */}
              <main>
                  <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/movie/:movieId" element={<DetailPage />} />
                      {/* 로그인 페이지에 setCurrentUser 함수를 props로 전달하여 로그인 성공 시 상태를 업데이트할 수 있도록 합니다. */}
                      <Route path="/login" element={<LoginPage setCurrentUser={setCurrentUser} />} />
                      <Route path="/signup" element={<SignupPage />} />
                  </Routes>
              </main>
          </div>
      );
  }

  // 다른 파일에서 App 컴포넌트를 사용할 수 있도록 내보냅니다.
  export default App;