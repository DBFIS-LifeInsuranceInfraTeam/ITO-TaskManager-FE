import React, { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/Login.module.css'; // Import the CSS file for styling
import { login } from '../api/login';
import logo from '../styles/image/logo-black.png';

const Login: React.FC = () => {
    const [id, setId] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleLogin = async (e: FormEvent) => {
      e.preventDefault();
      setError(null);

      try {
          const response = await login(id, password);
          //console.log("Login successful:", response);
          // 리다이렉트
          navigate('/', { state: { userData: response.data.userInfo } });
      } catch (error) {
          setError("로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요."); // Error message in Korean
      }
  };

  // 버튼이 활성화되었는지 여부를 계산하는 함수
  const isButtonEnabled = id.trim() !== '' && password.trim() !== '';

    return (
        <div className={styles.container}>
          <div className={styles.header}>
            <img src={logo} alt=""/>
          </div>
          <div className={styles.formContainer}>
          <form onSubmit={handleLogin}>
                <div className={styles.inputGroup}>
                    <label htmlFor="id">아이디</label>
                    <input 
                        type="text" 
                        id="id" 
                        value={id} 
                        onChange={(e) => setId(e.target.value)} 
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
