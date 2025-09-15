// React 라이브러리와 두 개의 중요한 'Hook'을 가져옵니다.
// - useState: 컴포넌트의 '상태'(기억해야 할 값)를 관리하게 해줍니다.
// - useEffect: 컴포넌트의 생명주기(생성, 업데이트 등)에 맞춰 특정 작업을 수행하게 해줍니다.
import React, { useState, useEffect } from 'react';

// 이 컴포넌트의 스타일을 정의한 CSS 파일을 가져옵니다.
import './App.css';

// App 이라는 이름의 '함수형 컴포넌트'를 정의합니다.
// React에서 컴포넌트는 UI를 구성하는 독립적인 부품입니다.
function App() {

  // 1. State 생성
  // 'movies'라는 이름의 state 변수를 선언합니다. 이 변수는 영화 목록 데이터를 저장할 공간입니다.
  // 'setMovies'는 'movies' state를 변경할 때 사용할 함수입니다.
  // useState([])는 'movies'의 초기값을 빈 배열([])로 설정한다는 의미입니다.
  const [movies, setMovies] = useState([]);

  // 2. Side Effect 처리 (API 호출)
  // useEffect는 컴포넌트가 화면에 처음 렌더링된 후에 특정 작업을 수행하고 싶을 때 사용합니다.
  // 여기서는 백엔드 API에서 영화 데이터를 가져오는 작업을 수행합니다.
  useEffect(() => {
    
    // fetch 함수를 사용해 백엔드의 API 엔드포인트에 GET 요청을 보냅니다.
    // 이 주소는 우리가 Spring Boot로 만든 API 주소입니다.
    fetch('/api/movies/now-playing')
      // 요청이 성공하면, 응답(response) 객체를 JSON 형태로 변환합니다.
      .then(response => response.json())
      // JSON 변환이 완료되면, 실제 데이터(data)를 얻게 됩니다.
      .then(data => {
        // 받아온 데이터를 콘솔에 출력하여 개발자 도구에서 확인할 수 있습니다.
        console.log('서버로부터 받은 데이터:', data);
        
        // 'setMovies' 함수를 호출하여 'movies' state를 서버에서 받아온 데이터로 업데이트합니다.
        // *** 중요: 이 함수가 호출되면, React는 이 컴포넌트를 자동으로 다시 렌더링하여 화면을 업데이트합니다. ***
        setMovies(data);
      })
      // 네트워크 오류 등 API 호출 중에 문제가 발생하면 콘솔에 에러를 출력합니다.
      .catch(error => console.error('영화 데이터를 가져오는 중 오류 발생:', error));

  // useEffect의 두 번째 인자로 빈 배열([])을 전달하면,
  // 이 코드는 컴포넌트가 화면에 '최초 한 번'만 렌더링될 때 실행됩니다.
  // 만약 이 배열을 생략하면, 컴포넌트가 리렌더링될 때마다 API를 호출하게 되어 무한 루프에 빠질 수 있습니다.
  }, []);

  // 3. UI 렌더링 (JSX)
  // 이 컴포넌트가 화면에 어떻게 보일지를 정의하는 부분입니다.
  // HTML과 비슷하지만, 중간에 { }를 사용해 JavaScript 코드를 넣을 수 있는 JSX 문법입니다.
  return (
    <div className="App">
      <header className="App-header">
        <h1>현재 상영 중인 영화</h1>
        
        {/* 영화 목록을 표시할 컨테이너 */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
          
          {/* 3항 연산자를 사용한 조건부 렌더링 */}
          {/* 'movies' state의 길이가 0보다 크면(데이터가 있으면) 영화 목록을 표시하고, 그렇지 않으면 로딩 메시지를 표시합니다. */}
          {movies.length > 0 ? (
            // 'movies' 배열을 순회하면서 각 'movie' 객체에 대해 UI 요소를 생성합니다.
            // JavaScript의 map 함수가 JSX 안에서 리스트를 렌더링하는 데 아주 유용하게 쓰입니다.
            movies.map(movie => (
              // React가 리스트의 각 항목을 효율적으로 관리하기 위해 'key'라는 고유한 속성이 반드시 필요합니다.
              // 여기서는 각 영화의 고유 ID인 movieId를 key로 사용합니다.
              <div key={movie.movieId} style={{ margin: '20px', maxWidth: '200px' }}>
                <img src={movie.posterUrl} alt={movie.movieTitle} style={{ width: '100%' }} />
                <h4 style={{ fontSize: '16px' }}>{movie.movieTitle}</h4>
              </div>
            ))
          ) : (
            <p>영화를 불러오는 중입니다...</p>
          )}
        </div>
      </header>
    </div>
  );
}

// 다른 파일에서 이 App 컴포넌트를 사용할 수 있도록 export(내보내기)합니다.
export default App;