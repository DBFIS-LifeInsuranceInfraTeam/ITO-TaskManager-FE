import React, { useEffect, useState } from 'react'
import styles from '../styles/Stat.module.css';
import before from '../styles/image/status/before.svg';
import complete from '../styles/image/status/complete.svg';
import progress from '../styles/image/status/progress.svg';
import pending from '../styles/image/status/pending.svg';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import Clock from './Clock';
import { getStatisticsByProjectId } from "../api/getStatisticsByProjectId";

// Chart.js의 기본 요소를 등록합니다.
ChartJS.register(ArcElement, Tooltip, Legend);

interface Statistics {
    beforePercentage: number;
    progressPercentage: number;
    completePercentage: number;
    delayedPercentage: number;
    totalTasks: number;
}

interface StatisticsResponse {
    statistics: Statistics;
    beforeIncrease: number;
    progressIncrease: number;
    completeIncrease: number;
    delayedIncrease: number;
}


const Stat: React.FC = () => {
    //const [dateTime, setDateTime] = useState<string>(getFormattedDateTime());
    const [statisticsData, setStatisticsData] = useState<StatisticsResponse | null>(null);

    useEffect(() => {
        const fetchStatistics = async () => {
            const userInfo = sessionStorage.getItem("userInfo")
                ? JSON.parse(sessionStorage.getItem("userInfo") as string)
                : null;

            if (userInfo && userInfo.projectId) {
                const projectIds = userInfo.projectId; // 배열로 정의
                const currentDate = new Date();
                const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // MM format
                const year = currentDate.getFullYear().toString();

                try {
                    const resStatisticsData = await getStatisticsByProjectId(projectIds, `${year}-${month}`);
                    console.log(resStatisticsData)
                    setStatisticsData(resStatisticsData);
                } catch (error) {
                    console.error("Error fetching statistics:", error);
                }
            }
        };

        fetchStatistics();
    }, []);

 

// const data = {
//     labels: ['시작 전', '진행 중', '완료', '지연'],
//     datasets: [
//         {
//             data: [
//                 statisticsData?.statistics.beforePercentage ?? 0,
//                 statisticsData?.statistics.progressPercentage ?? 0,
//                 statisticsData?.statistics.completePercentage ?? 0,
//                 statisticsData?.statistics.delayedPercentage ?? 0
//             ],
//             backgroundColor: ['#CECECE', '#0887C9', '#86C440', '#DB4A26'],
//             borderColor: ['#CECECE', '#0887C9', '#86C440', '#DB4A26'],
//             borderWidth: 1,
//             cutout: '75%',
//         },
//     ],
// };

//       const options = {
//         plugins: {
//           legend: {
//             display: false, // 범례를 비활성화
//           },
//           maintainAspectRatio: false, // 차트 비율을 강제하지 않도록 설정
//         },
//       };


const hasData = !!(statisticsData?.statistics?.totalTasks && statisticsData.statistics.totalTasks > 0);




const data = {
    labels: ['시작 전', '진행 중', '완료', '지연'],
    datasets: [
        {
            
            data: hasData
                ? [
                    statisticsData?.statistics.beforePercentage ?? 0,
                    statisticsData?.statistics.progressPercentage ?? 0,
                    statisticsData?.statistics.completePercentage ?? 0,
                    statisticsData?.statistics.delayedPercentage ?? 0,
                ]
                : [1],   // 데이터가 없을 때 전체를 100%로 표시 // 데이터가 없을 때 100%로 표시
            backgroundColor: hasData
                ? ['#CECECE', '#0887C9', '#86C440', '#DB4A26']
                : ['#E0E0E0'],  // 데이터가 없을 때 회색
            borderColor: hasData
                ? ['#CECECE', '#0887C9', '#86C440', '#DB4A26']
                : ['#E0E0E0'],
            borderWidth: 1,
            cutout: '75%',
        },
    ],
};

const options = {
    plugins: {
        legend: { display: false },
        tooltip: { enabled: hasData},  // 데이터가 없을 때 툴팁 비활성화
    },
    maintainAspectRatio: false,
};



    return (
    
        <div className={styles.stat}>
            <Clock/>
            
            <div className={styles.chart}>
                <p>이번 달 진행률</p>
                <div className={styles.chartContainer}>
                    <div className={styles.chartWrapper}>
                        <Doughnut data={data} options={options} />
                        {!hasData && <div className={styles.noDataText}>데이터가 없습니다.</div>}
                    </div>
                </div>
                {hasData ? (
                <ul>
                    <li>
                        <div>
                            <img src={before} alt='' />
                            <span>시작 전</span>
                        </div>
                        <div>
                            <span>{statisticsData?.statistics?.beforePercentage ?? 0}%</span>
                            <span className={
                                statisticsData?.beforeIncrease !== undefined && statisticsData.beforeIncrease > 0 
                                ? styles.arrowUp 
                                : statisticsData?.beforeIncrease !== undefined && statisticsData.beforeIncrease < 0 
                                ? styles.arrowDown 
                                : styles.neutral}>
                                {statisticsData?.beforeIncrease !== undefined && statisticsData.beforeIncrease > 0 
                                ? '↑' 
                                : statisticsData?.beforeIncrease !== undefined && statisticsData.beforeIncrease < 0 
                                ? '↓' 
                                : '-'}
                            </span>
                        </div>
                    </li>
                    <li>
                        <div>
                            <img src={progress} alt=''></img>
                            <span>진행 중</span>
                        </div>
                        <div>
                            <span>{statisticsData?.statistics?.progressPercentage}%</span>
                            <span className={
                                statisticsData?.progressIncrease !== undefined && statisticsData.progressIncrease > 0 
                                ? styles.arrowUp 
                                : statisticsData?.progressIncrease !== undefined && statisticsData.progressIncrease < 0 
                                ? styles.arrowDown 
                                : styles.neutral}>
                                {statisticsData?.progressIncrease !== undefined && statisticsData.progressIncrease > 0 
                                ? '↑' 
                                : statisticsData?.progressIncrease !== undefined && statisticsData.progressIncrease < 0 
                                ? '↓' 
                                : '-'}
                            </span>
                        </div>
                    </li>
                    <li>
                        <div>
                            <img src={complete} alt=''></img>
                            <span>완료</span>
                        </div>
                        <div>
                        <span>{statisticsData?.statistics?.completePercentage}%</span>
                            <span className={
                                statisticsData?.completeIncrease !== undefined && statisticsData.completeIncrease > 0 
                                ? styles.arrowUp 
                                : statisticsData?.completeIncrease !== undefined && statisticsData.completeIncrease < 0 
                                ? styles.arrowDown 
                                : styles.neutral}>
                                {statisticsData?.completeIncrease !== undefined && statisticsData.completeIncrease > 0 
                                ? '↑' 
                                : statisticsData?.completeIncrease !== undefined && statisticsData.completeIncrease < 0 
                                ? '↓' 
                                : '-'}
                            </span>
                        </div>
                    </li>
                    <li>
                        <div>
                            <img src={pending} alt=''></img>
                            <span>지연</span>
                        </div>
                        <div>
                        <span>{statisticsData?.statistics?.delayedPercentage}%</span>
                            <span className={
                                statisticsData?.delayedIncrease !== undefined && statisticsData.delayedIncrease > 0 
                                ? styles.arrowUp 
                                : statisticsData?.delayedIncrease !== undefined && statisticsData.delayedIncrease < 0 
                                ? styles.arrowDown 
                                : styles.neutral}>
                                {statisticsData?.delayedIncrease !== undefined && statisticsData.delayedIncrease > 0 
                                ? '↑' 
                                : statisticsData?.delayedIncrease !== undefined && statisticsData.delayedIncrease < 0 
                                ? '↓' 
                                : '-'}
                            </span>
                        </div>
                    </li>
                </ul>
            ) : (
                <span className={styles.noTask}>현재 등록된 업무가 없습니다.</span>
            )}
                    
                

            </div>
        </div>
    
    );
}

export default Stat;