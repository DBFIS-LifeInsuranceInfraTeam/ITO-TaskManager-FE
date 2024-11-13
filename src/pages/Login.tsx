import React, { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/Login.module.css'; // Import the CSS file for styling
import { login } from '../api/login';
import logo from '../styles/image/logo-black.png';

const Login: React.FC = () => {
    const [userId, setUserId] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleLogin = async (e: FormEvent) => {
      e.preventDefault();
      setError(null);

      try {
          const response = await login(userId, password);
          //console.log("Login successful:", response);
          // 리다이렉트
          
          sessionStorage.setItem('userInfo', JSON.stringify(response.data.userInfo));
          sessionStorage.setItem('token', response.data.token);

          const redirectUrl = sessionStorage.getItem('redirectUrl') || '/'; // 기본은 홈 페이지로
        sessionStorage.removeItem('redirectUrl'); // 리다이렉트 후에는 저장된 URL 제거
        navigate(redirectUrl, { replace: true });
        
      } catch (error) {
          setError("로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요."); // Error message in Korean
      }
  };

  // 버튼이 활성화되었는지 여부를 계산하는 함수
  const isButtonEnabled = userId.trim() !== '' && password.trim() !== '';

    return (
        <div className={styles.container}>
          <div className={styles.header}>
            <img src={logo} alt=""/>
          </div>
          <div className={styles.formContainer}>
          <form onSubmit={handleLogin}>
                <div className={styles.inputGroup}>
                    <label htmlFor="userId">아이디</label>
                    <input 
                        type="text" 
                        id="userId" 
                        value={userId} 
                        onChange={(e) => setUserId(e.target.value)} 
                        placeholder="아이디를 입력하세요." 
                        required 
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="password">비밀번호</label>
                    <input 
                        type="password" 
                        id="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        placeholder="비밀번호를 입력하세요." 
                        required 
                    />
                </div>
                <button 
                    type="submit"
                    disabled={!isButtonEnabled} // 비활성화 상태 설정
                >
                    로그인
                </button>
                <div className={styles.signuplink}>
                  아직 계정이 없으신가요? <Link to="/signup">계정 만들기</Link>
                </div>
            </form>            
            
          </div>
          {error && <div className={styles.alert}>{error}</div>} {/* 오류 메시지 표시 */}
        </div>
    );
};

export default Login;
