import React, { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Login.module.css'; // Import the CSS file for styling
import { login } from '../api/login';
import logo from '../styles/image/logo-black.png';

const Signup:React.FC = () => {
  const [id, setId] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [passwordCheck, setPasswordCheck] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: FormEvent) => {
      e.preventDefault();
      setError(null);

      try {
          const response = await login(id, password);
          console.log("Login successful:", response);
          // Redirect or update state after successful login here
      } catch (error) {
          setError("로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요."); // Error message in Korean
      }
  };

    return (
        <div className={styles.container}>
            <img src={logo} alt=""/>
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
                <div className={styles.inputGroup}>
                    <label htmlFor="passwordCheck">비밀번호 확인</label>
                    <input 
                        type="password" 
                        id="password" 
                        value={passwordCheck} 
                        onChange={(e) => setPasswordCheck(e.target.value)} 
                        placeholder="비밀번호를 재입력하세요." 
                        required 
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="name">이름</label>
                    <input 
                        type="text" 
                        id="name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        placeholder="이름을 입력하세요." 
                        required 
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="phoneNumber">전화번호</label>
                    <input 
                        type="string" 
                        id="phoneNumber" 
                        value={phoneNumber} 
                        onChange={(e) => setPhoneNumber(e.target.value)} 
                        placeholder="비밀번호를 입력하세요." 
                        required 
                    />
                </div>
                <button type="submit">가입하기</button>
            </form>
            <div className={styles.signuplink}>
              이미 계정이 있으신가요?<Link to="/login">로그인하기</Link>
            </div>
        </div>
    );
}

export default Signup