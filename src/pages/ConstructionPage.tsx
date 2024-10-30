import React from 'react'
import styles from '../styles/ConstructionPage.module.css';
import constructionlogo from '../styles/image/construction-logo.png';
const ConstructionPage: React.FC = () => {
  return (
    <div className={styles.container}>
        <img src={constructionlogo} alt=""/>
        <span>추후 구현 예정</span>
    </div>
  )
}

export default ConstructionPage