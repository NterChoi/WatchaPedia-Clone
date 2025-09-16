 // React 라이브러리와 react-router-dom에서 필요한 기능들을 가져옵니다.
  // React는 UI를 만들기 위한 기본 라이브러리입니다.
  // Routes, Route, Link는 페이지 이동(라우팅)을 처리하기 위한 컴포넌트입니다.
  import React from 'react';
  import { Routes, Route, Link } from 'react-router-dom';

  // 각 페이지를 구성하는 컴포넌트들을 가져옵니다.
  import HomePage from './pages/HomePage';
  import DetailPage from './pages/DetailPage';
  import LoginPage from './pages/LoginPage';
  import SignupPage from './pages/SignupPage';

  // CSS 스타일을 적용하기 위해 App.css 파일을 가져옵니다.
  import './App.css';

  // App 컴포넌트는 우리 애플리케이션의 최상위 컴포넌트입니다.
  function App() {
      // React 컴포넌트는 UI를 설명하는 JSX라는 문법을 반환(return)합니다.
      // JSX는 HTML과 매우 유사하게 생겼습니다.
      return (
          <div className="App">
              {/* 상단 네비게이션 메뉴 부분입니다. */}
              {/* <nav> 태그는 의미를 나타내는 HTML 태그일 뿐, 특별한 기능은 없습니다. */}
              <nav style={{ padding: '20px', backgroundColor: '#20232a', textAlign: 'left' }}>
                  {/* <Link> 컴포넌트는 HTML의 <a> 태그와 비슷하지만, 페이지 전체를 새로고침하지 않고 화면만 부드럽게 전환해줍니다. */}
                  {/* to="..." 속성으로 이동할 경로를 지정합니다. */}
                  <Link to="/" style={{ color: 'white', textDecoration: 'none', marginRight: '20px', fontSize: '18px' }}>
                      홈
                  </Link>
                  <Link to="/login" style={{ color: 'white', textDecoration: 'none', marginRight: '20px', fontSize: '18px' }}>
                      로그인
                  </Link>
                  <Link to="/signup" style={{ color: 'white', textDecoration: 'none', fontSize: '18px' }}>
                      회원가입
                  </Link>
              </nav>

              {/* 페이지의 메인 콘텐츠가 표시될 부분입니다. */}
              <main>
                  {/* <Routes>는 여러 개의 <Route>를 감싸서, 현재 URL 경로에 맞는 단 하나의 <Route>만 화면에 보여주는 역할을 합니다. */}
                  <Routes>
                      {/* <Route>는 특정 경로(path)와 그 경로에서 보여줄 컴포넌트(element)를 짝지어줍니다. */}
                      {/* 주소창의 경로가 "/" 이면 <HomePage> 컴포넌트를 보여줍니다. */}
                      <Route path="/" element={<HomePage />} />

                      {/* 경로에 ':변수명' 형태로 작성하면, 해당 부분의 실제 값을 파라미터로 받을 수 있습니다. */}
                      {/* 예를 들어 /movie/123 으로 접속하면, movieId 파라미터 값은 '123'이 됩니다. */}
                      <Route path="/movie/:movieId" element={<DetailPage />} />

                      {/* 주소창의 경로가 "/login" 이면 <LoginPage> 컴포넌트를 보여줍니다. */}
                      <Route path="/login" element={<LoginPage />} />

                      {/* 주소창의 경로가 "/signup" 이면 <SignupPage> 컴포넌트를 보여줍니다. */}
                      <Route path="/signup" element={<SignupPage />} />
                  </Routes>
              </main>
          </div>
      );
  }

  // 다른 파일에서 App 컴포넌트를 사용할 수 있도록 내보냅니다.
  export default App;