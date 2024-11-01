import React, { useEffect, useState } from 'react';
import styles from '../styles/Setting.module.css';


interface User {
    userId: string; 
    name: string;
    unit: string;
    projectId: string;
    email: string;
    phoneNumber: string;
    photo: string;
    position: string;
}

const Setting: React.FC = () => {

    const [userInfo, setUserInfo] = useState<User | null>();

    useEffect(() => {
        const userInfoData = sessionStorage.getItem("userInfo")
          ? JSON.parse(sessionStorage.getItem("userInfo") as string)
          : null;
          console.log(userInfo)
          setUserInfo(userInfoData);
      }, []);



  return (
    <div className={styles.container}> {/* className을 사용하여 스타일 적용 */}
        <img src={`http://localhost:8080/${userInfo?.photo}`} alt='' className={styles.profile}/>
      <h1 className={styles.title}>{userInfo?.name} {userInfo?.position} 님 안녕하세요!</h1> {/* 제목에 클래스 추가 */}
      
      <div className={styles.detail}>
        <label htmlFor="userId">아이디</label>
        <p id="userId">{userInfo?.userId}</p>
      </div>
      
      <div className={styles.detail}>
        <label htmlFor="email">이메일</label>
        <p id="email">{userInfo?.email}</p>
      </div>

      <div className={styles.detail}>
        <label htmlFor="phoneNumber">전화번호</label>
        <p id="phoneNumber">{userInfo?.phoneNumber}</p>
      </div>

      <div className={styles.detail}>
        <label htmlFor="projectId">프로젝트아이디</label>
        <p id="projectId">{userInfo?.projectId}</p>
      </div>
      
      <div className={styles.detail}>
        <label htmlFor="unit">유닛</label>
        <p id="unit">{userInfo?.unit}</p>
      </div>
      


      {/* 수정 버튼 추가 */}
      <div className={styles.buttonContainer}>
        <button className={styles.editButton}>회원정보 수정</button>
      </div>
    </div>
  );
}

export default Setting;
