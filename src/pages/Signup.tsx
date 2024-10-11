import React, { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Login.module.css'; // Import the CSS file for styling
import { signup } from '../api/signup';
import logo from '../styles/image/logo-black.png';

const Signup:React.FC = () => {
  const [id, setId] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [passwordCheck, setPasswordCheck] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    // 버튼이 활성화되었는지 여부를 계산하는 함수
  const isButtonEnabled = id.trim() !== '' && password.trim() !== '' && 
  passwordCheck.trim() !== '' && name.trim() !== '' && 
  phoneNumber.trim() !== '';
    
  const handleSignup = async (e: FormEvent) => {
      e.preventDefault();
      setError(null);

      try {
          const response = await signup(id, password);
          console.log("Signup successful:", response);
          // Redirect or update state after successful login here
      } catch (error) {
          setError("이미 가입된 사용자입니다.");
      }
  };

    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <img src={logo} alt=""/>
        </div>
        <div className={styles.formContainer}>
            <form onSubmit={handleSignup}>
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
                <div className={styles.inputGroup}>
                    <label htmlFor="phoneNumber">팀</label>
                    <input 
                        type="string" 
                        id="phoneNumber" 
                        value={phoneNumber} 
                        onChange={(e) => setPhoneNumber(e.target.value)} 
                        placeholder="팀 입력하세요." 
                        required 
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="phoneNumber">유닛</label>
                    <input 
                        type="string" 
                        id="phoneNumber" 
                        value={phoneNumber} 
                        onChange={(e) => setPhoneNumber(e.target.value)} 
                        placeholder="유닛을 입력하세요." 
                        required 
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="phoneNumber">직급</label>
                    <input 
                        type="string" 
                        id="phoneNumber" 
                        value={phoneNumber} 
                        onChange={(e) => setPhoneNumber(e.target.value)} 
                        placeholder="직급을 입력하세요." 
                        required 
                    />
                </div>
                <button 
                    type="submit"
                    disabled={!isButtonEnabled} // 비활성화 상태 설정
                >
                    가입하기
                </button>
            </form>
            
        </div>
        <div className={styles.signuplink}>
              이미 계정이 있으신가요?<Link to="/login">로그인하기</Link>
            </div>
        </div>
    );
}

export default Signup