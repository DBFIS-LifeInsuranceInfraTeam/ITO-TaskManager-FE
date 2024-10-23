import React, { useEffect, useState } from 'react'
import styles from '../styles/Stat.module.css';
import complete from '../styles/image/status/complete.svg';
import progress from '../styles/image/status/progress.svg';
import pending from '../styles/image/status/pending.svg';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { getDate } from '../api/getDate';

// Chart.js의 기본 요소를 등록합니다.
ChartJS.register(ArcElement, Tooltip, Legend);


const Stat: React.FC = () => {
    //const [dateTime, setDateTime] = useState<string>(getFormattedDateTime());

    const [date, setDate] = useState<Date>(new Date());
    const [loading, setLoading] = useState<boolean>(true); // 로딩 상태
    const [error, setError] = useState<string | null>(null); // 에러 메시지 저장

    useEffect(() => {
      const fetchDate = async () => {
        try {
          const data = await getDate(); // 백엔드에서 날짜 데이터를 가져옴
          setDate(data); // 가져온 데이터를 설정
        } catch (err) {
          setError('서버에서 데이터를 가져오지 못했습니다.'); // 에러 메시지 설정
        } finally {
          setLoading(false); // 로딩 상태 해제
        }
      };
  
      fetchDate();
    }, []);
  
    const formatDate = (date: Date) => {
      // 날짜 형식: YYYY/MM/DD (요일)
      const dateString = date
        .toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          weekday: 'short', // 요일
        })
        .replace(/\./g, '/'); // '.' 대신 '/'로 변경
  
      // 시간 형식: 12시간제 (AM/PM)
      const timeString = date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
  
      return `${dateString} ${timeString}`;
    };
  

  
    const data = {
        labels: ['지연', '진행 중', '완료'],
        datasets: [
          {
            
            data: [26, 54, 20],
            backgroundColor: ['#DB4A26', '#0887C9', '#86C440'],
            borderColor: ['#DB4A26', '#0887C9', '#86C440'],
            borderWidth: 1,
            cutout: '75%',
          },
        ],
      };

      const options = {
        plugins: {
          legend: {
            display: false, // 범례를 비활성화
          },
          maintainAspectRatio: false, // 차트 비율을 강제하지 않도록 설정
        },
      };
  return (
    
        <div className={styles.stat}>
            <div className={styles.title}>
                <p className={styles.subtitle}>오늘의 통계</p>
                {error ? (
                  <p className={styles.timeerror}>{'⚠ '+formatDate(date)}</p>
                ) : (
                  <p className={styles.time}>{'  '+formatDate(date)}</p>
                )}
            </div>
            
            <div className={styles.chart}>
                <p>이번 달 진행률</p>
                <div className={styles.chartContainer}>
                    <div className={styles.chartWrapper}>
                        <Doughnut data={data} options={options} />
                    </div>
                </div>
                    <ul>
                        <li>
                            <div>
                                <img src={progress} alt=''></img>
                                <span>진행 중</span>
                            </div>
                            <div>
                                <span>54%</span>
                                <span className={styles.arrowUp}>↑</span>
                            </div>
                        </li>
                        <li>
                            <div>
                                <img src={complete} alt=''></img>
                                <span>완료</span>
                            </div>
                            <div>
                                <span>20%</span>
                                <span className={styles.arrowUp}>↑</span>
                            </div>
                        </li>
                        <li>
                            <div>
                                <img src={pending} alt=''></img>
                                <span>지연</span>
                            </div>
                            <div>
                                <span>26%</span>
                                <span className={styles.arrowDown}>↓</span>
                            </div>
                        </li>
                    </ul>
                

            </div>
        </div>
    
    );
}

export default Stat;