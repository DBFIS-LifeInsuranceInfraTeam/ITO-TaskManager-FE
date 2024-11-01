import React, { useEffect, useState } from 'react'
import styles from '../styles/Stat.module.css';
import complete from '../styles/image/status/complete.svg';
import progress from '../styles/image/status/progress.svg';
import pending from '../styles/image/status/pending.svg';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import Clock from './Clock';

// Chart.js의 기본 요소를 등록합니다.
ChartJS.register(ArcElement, Tooltip, Legend);


const Stat: React.FC = () => {
    //const [dateTime, setDateTime] = useState<string>(getFormattedDateTime());

    

    
  

  
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
            <Clock/>
            
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