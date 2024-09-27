import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Login.module.css';
const Login:React.FC = () => {
  return (
    <div>
        아이디<input></input>
        패스워드<input></input>
        <Link to="/" className={styles.loginBtn}>
            로그인
        </Link>
        <Link to="/signup" className={styles.signupBtn}>
            회원가입
        </Link>

    </div>
  )
}

export default Login