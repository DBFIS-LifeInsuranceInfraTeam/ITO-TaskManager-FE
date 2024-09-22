import React, { useEffect, useState } from 'react'
import styles from '../styles/Stat.module.css';
import complete from '../styles/image/status/complete.svg';
import progress from '../styles/image/status/progress.svg';
import pending from '../styles/image/status/pending.svg';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Chart.js의 기본 요소를 등록합니다.
ChartJS.register(ArcElement, Tooltip, Legend);


const Stat: React.FC = () => {
    const [dateTime, setDateTime] = useState<string>(getFormattedDateTime());

    useEffect(() => {
      // 매초마다 시간과 날짜를 업데이트하는 타이머 설정
      const timer = setInterval(() => {
        setDateTime(getFormattedDateTime());
      }, 1000);
  
      // 컴포넌트 언마운트 시 타이머 정리
      return () => clearInterval(timer);
    }, []);
  
    // 현재 날짜와 시간을 포맷하는 함수
    function getFormattedDateTime() {
      const now = new Date();
      const dayNames = ['일', '월', '화', '수', '목', '금', '토']; // 요일 한글 배열
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
      const date = String(now.getDate()).padStart(2, '0');
      const day = dayNames[now.getDay()]; // 한글 요일
  
      // 시간 포맷: HH:MM (AM/PM)
      const time = now.toLocaleTimeString('en-US',{
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
  
      return `${year}/${month}/${date} (${day}) ${time}`;
    }
  
    const data = {
        labels: ['지연', '진행 중', '완료'],
        datasets: [
          {
            
            data: [26, 54, 20],
            backgroundColor: ['#FF2727', '#006AFF', '#52C93F'],
            borderColor: ['#FF2727', '#006AFF', '#52C93F'],
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
            <div>
                <p>오늘의 통계</p>
                <span>{dateTime}</span> 
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