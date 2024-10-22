import React from 'react'
import styles from '../styles/Loading.module.css';
import constructionlogo from '../styles/image/construction-logo.png';
const Loading: React.FC = () => {
  return (
    <div className={styles.container}>
        <img src={constructionlogo} alt=""/>
        <span>추후 구현 예정</span>
    </div>
  )
}

export default Loading