// React의 기본 기능과 'Hook'들을 가져옵니다.
// useState: 컴포넌트 안에서 변하는 값(상태)을 관리하는 Hook
// useNavigate: 코드를 통해 다른 페이지로 이동시킬 때 사용하는 Hook
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// SignupPage 컴포넌트 정의
function SignupPage() {
    // useState를 사용하여 컴포넌트가 기억할 값들을 만듭니다.
    // const [변수명, 변수를변경할함수] = useState(초기값);
    // input에 입력된 이메일 값을 저장할 'email' 상태
    const [email, setEmail] = useState('');
    // input에 입력된 비밀번호 값을 저장할 'password' 상태
    const [password, setPassword] = useState('');
    // API 요청 후 사용자에게 보여줄 메시지를 저장할 'message' 상태
    const [message, setMessage] = useState('');
    // 메시지가 성공 메시지인지, 에러 메시지인지 구분하기 위한 'isError' 상태
    const [isError, setIsError] = useState(false);

    // 페이지 이동 함수를 초기화합니다.
    const navigate = useNavigate();

    // '가입하기' 버튼을 눌렀을 때 실행될 함수입니다.
    // async 키워드는 이 함수 안에서 비동기 작업(API 요청 등)을 기다릴 것임을 의미합니다.
    const handleSubmit = async (e) => {
        // e.preventDefault()는 form 태그의 기본 동작(페이지 새로고침)을 막습니다.
        e.preventDefault();
        // 메시지를 초기화합니다.
        setMessage('');
        setIsError(false);

        try {
            // fetch 함수를 사용해 백엔드 API에 네트워크 요청을 보냅니다.
            // await 키워드는 API 응답이 올 때까지 다음 코드로 넘어가지 않고 기다리게 만듭니다.
            const response = await fetch('/api/user/signup', {
                method: 'POST', // 요청 방식은 POST
                headers: {
                    'Content-Type': 'application/json', // 보내는 데이터의 형식이 JSON임을 알립니다.
                },
                // body에는 서버로 보낼 실제 데이터를 담습니다.
                // JavaScript 객체를 JSON 문자열로 변환하기 위해 JSON.stringify()를 사용합니다.
                body: JSON.stringify({ email, password }),
            });

            // API 응답으로 받은 JSON 데이터를 JavaScript 객체로 변환합니다.
            const data = await response.json();

            // 응답의 HTTP 상태 코드가 201(Created)이면 회원가입 성공입니다.
            if (response.status === 201) {
                setMessage('회원가입에 성공했습니다. 잠시 후 로그인 페이지로 이동합니다.');
                setIsError(false);
                // setTimeout을 사용해 2초 후에 로그인 페이지로 이동시킵니다.
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                // 그 외의 경우(409 충돌, 500 서버에러 등)는 실패로 간주합니다.
                setIsError(true);
                // 서버가 보낸 에러 메시지를 사용자에게 보여줍니다.
                setMessage(data.msg || '회원가입 중 오류가 발생했습니다.');
            }
        } catch (error) {
            // fetch 자체에 실패하는 등 네트워크 오류가 발생했을 때 실행됩니다.
            setIsError(true);
            setMessage('서버와 통신 중 오류가 발생했습니다.');
            console.error('Signup error:', error);
        }
    };

    // 화면에 보여줄 UI를 JSX로 작성하여 반환합니다.
    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '10px' }}>
            <h2>회원가입</h2>
            {/* form 태그의 onSubmit 이벤트에 위에서 만든 handleSubmit 함수를 연결합니다. */}
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>이메일</label>
                    <input
                        type="email"
                        id="email"
                        value={email} // input의 값을 'email' 상태와 동기화합니다.
                        // onChange 이벤트는 input의 내용이 변경될 때마다 실행됩니다.
                        // e.target.value는 현재 input에 입력된 값입니다.
                        // setEmail 함수를 호출하여 'email' 상태를 업데이트합니다.
                        onChange={(e) => setEmail(e.target.value)}
                        required // 필수 입력 항목으로 지정합니다.
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>비밀번호</label>
                    <input
                        type="password"
                        id="password"
                        value={password} // input의 값을 'password' 상태와 동기화합니다.
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>
                <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}>
                    가입하기
                </button>
            </form>
            {/* message 상태에 값이 있을 때만 <p> 태그를 화면에 보여줍니다. (조건부 렌더링) */}
            {message && (
                <p style={{ marginTop: '15px', color: isError ? 'red' : 'green' }}>
                    {message}
                </p>
            )}
        </div>
    );
}

export default SignupPage;