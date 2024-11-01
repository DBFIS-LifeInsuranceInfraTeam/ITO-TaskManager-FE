import React, { useEffect, useState } from 'react'
import styles from '../styles/Stat.module.css';
import { getDate } from '../api/getDate';

const Clock: React.FC = () => {
    const [date, setDate] = useState<Date>(new Date());
    const [loading, setLoading] = useState<boolean>(true); // 로딩 상태
    const [error, setError] = useState<string | null>(null); // 에러 메시지 저장


    useEffect(() => {
        const fetchDate = async () => {
          try {
            const data = await getDate(); // 백엔드에서 날짜 데이터를 가져옴
            setDate(
              new Date(
                data.year,
                data.month - 1, // 월을 0부터 시작하도록 조정
                data.day,
                data.hour,
                data.minute,
                data.second
              )
            );
          } catch (err) {
            setError('서버에서 데이터를 가져오지 못했습니다.');
          } finally {
            setLoading(false);
          }
        };
    
        fetchDate(); // 첫 번째 실행
    
        const intervalId = setInterval(fetchDate, 60000); // 1초마다 fetchDate 호출
    
        return () => clearInterval(intervalId); // 컴포넌트가 언마운트될 때 인터벌 정리
      }, []);
    
      const formatDate = (date: Date) => {
        // 날짜 형식: YYYY/MM/DD (요일)
        // const dateString = date
        //   .toLocaleDateString('ko-KR', {
        //     year: 'numeric',
        //     month: '2-digit',
        //     day: '2-digit',
        //     weekday: 'short', // 요일
        //   })
        //   .replace(/\./g, '/')
        //   .replace(/\/+$/, ''); // 문자열 끝에 붙는 모든 '/' 제거
  
        // // 시간 형식: 12시간제 (AM/PM)
        // const timeString = date.toLocaleTimeString('en-US', {
        //   hour: 'numeric',
        //   minute: '2-digit',
        //   hour12: true,
        // });
        const dateString = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')} (${date.toLocaleDateString('ko-KR', { weekday: 'short' })}) ${date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false })}`;
    
        //return `${dateString} ${timeString}`;
        return dateString;
      };


  return (
    <div className={styles.title}>
                <p className={styles.subtitle}>오늘의 통계</p>
                {error ? (
                  <p className={styles.timeerror}>{'⚠ '+formatDate(date)}</p>
                ) : (
                  <p className={styles.time}>{'  '+formatDate(date)}</p>
                )}
            </div>
  )
}

export default Clock