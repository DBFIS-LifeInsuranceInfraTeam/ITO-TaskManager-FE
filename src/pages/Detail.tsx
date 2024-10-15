import React from 'react';
import styles from '../styles/DetailPage.module.css';

const Detail: React.FC = () => {
  return (
    <div className={styles.container}> {/* className을 사용하여 스타일 적용 */}
      <h1 className={styles.title}>업무 상세정보</h1> {/* 제목에 클래스 추가 */}
      
      <div className={styles.detail}>
        <label htmlFor="title">제목</label>
        <p id="title">SSL인증서 교체</p>
      </div>
      
      <div className={styles.detail}>
        <label htmlFor="duration">기간</label>
        <p id="duration">2024-01-01 ~ 2024-12-31</p>
      </div>
      
      <div className={styles.detail}>
        <label htmlFor="process">ITO 프로세스</label>
        <p id="process">변경</p>
      </div>
      
      <div className={styles.detail}>
        <label htmlFor="manager">담당자</label>
        <p id="manager">김소연</p>
      </div>
      
      <div className={styles.detail}>
        <label htmlFor="content">내용</label>
        <p id="content">SSL인증서 교체작업</p>
      </div>

      {/* 수정 버튼 추가 */}
      <div className={styles.buttonContainer}>
        <button className={styles.editButton}>수정</button>
      </div>
    </div>
  );
}

export default Detail;
