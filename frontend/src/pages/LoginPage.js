// SignupPage와 마찬가지로 React의 기본 기능과 Hook들을 가져옵니다.
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// LoginPage 컴포넌트 정의
function LoginPage() {
    // 로그인 폼에 필요한 이메일, 비밀번호, 메시지, 에러 여부를 상태로 관리합니다.
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const navigate = useNavigate();

    // '로그인' 버튼을 눌렀을 때 실행될 함수입니다.
    const handleSubmit = async (e) => {
        e.preventDefault(); // form의 기본 동작(새로고침) 방지
        setMessage('');
        setIsError(false);

        try {
            // 이번에는 '/api/user/login' API를 호출합니다.
            const response = await fetch('/api/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            // response.ok는 HTTP 상태 코드가 200-299 범위에 있는지 여부를 boolean으로 알려줍니다.
            // 로그인은 성공 시 200(OK)을 반환하므로 response.ok로 성공 여부를 체크할 수 있습니다.
            if (response.ok) {
                setIsError(false);
                setMessage('로그인에 성공했습니다! 잠시 후 홈으로 이동합니다.');

                // 실제 애플리케이션에서는 여기서 서버가 보내준 토큰을 저장하거나,
                // 사용자 정보를 전역 상태(Recoil, Redux, Context API 등)에 저장하는 로직이 들어갑니다.

                setTimeout(() => {
                    navigate('/'); // 2초 후 홈 페이지로 이동
                }, 2000);
            } else {
                // 401(Unauthorized) 등 로그인 실패 시
                setIsError(true);
                setMessage(data.msg || '로그인 중 오류가 발생했습니다.');
            }
        } catch (error) {
            // 네트워크 통신 자체의 실패
            setIsError(true);
            setMessage('서버와 통신 중 오류가 발생했습니다.');
            console.error('Login error:', error);
        }
    };

    // 화면에 보여줄 UI (JSX)
    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '10px' }}>
            <h2>로그인</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>이메일</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>비밀번호</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>
                <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px' }}>
                    로그인
                </button>
            </form>
            {/* 메시지가 있을 때만 조건부로 렌더링 */}
            {message && (
                <p style={{ marginTop: '15px', color: isError ? 'red' : 'green' }}>
                    {message}
                </p>
            )}
        </div>
    );
}

export default LoginPage;