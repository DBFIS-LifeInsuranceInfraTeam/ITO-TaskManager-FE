import React, { useEffect, useState } from 'react';
import { Card, Typography, Grid, Badge } from 'antd';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { getStatisticsByProjectId } from "../api/statistics/getStatisticsByProjectId";

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

// Chart.js의 기본 요소를 등록합니다.
ChartJS.register(ArcElement, Tooltip, Legend);
interface Statistics {
    projectId: string;
    month: string;
    totalTasks: number;
    beforePercentage: number;
    progressPercentage: number;
    completePercentage: number;
    delayedPercentage: number;
    previousBeforePercentage: number;
    previousProgressPercentage: number;
    previousCompletePercentage: number;
    previousDelayedPercentage: number;
    [key: string]: number | string; // 추가적인 키 접근 허용
  }
  

interface StatisticsResponse {
    statistics: Statistics;
    beforeIncrease: number;
    progressIncrease: number;
    completeIncrease: number;
    delayedIncrease: number;
}

const Stat: React.FC = () => {

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

    
  const screens = useBreakpoint(); // 화면 크기 감지
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

  const badgeStatus = ['#CECECE', '#0887C9', '#86C440', '#DB4A26']

  const options = {
    plugins: {
      legend: { display: false },
      tooltip: { enabled: hasData },
    },
    maintainAspectRatio: false,
  };

  // 반응형 스타일
  const containerStyle: React.CSSProperties = screens.xl
  ? {
      width: '250px',
      backgroundColor: '#F8F7F1',
      height: '100vh',
      position: 'sticky',
      top: 0,
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column',
      padding: '16px',
      boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
    }
  : screens.md
  ? {
      width: '200px', // 중간 화면에서 줄어든 너비
      backgroundColor: '#F8F7F1',
      padding: '16px 8px',
      marginBottom: '16px',
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
      height: '100vh',
    }
  : {
      width: '100%',
      backgroundColor: '#F8F7F1',
      padding: '16px 8px',
      marginBottom: '16px',
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
      height: '100vh',
    };

const cardStyle: React.CSSProperties = screens.xl
  ? {
      marginTop: '40px',
      
    }
  : screens.md
  ? {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      marginTop: '20px',
    }
  : {
      width: '100%',
      marginTop: '20px',
      
      
    };

const doughnutContainerStyle: React.CSSProperties = screens.xl
  ? {
      width: '100%',
      height: '200px',
      position: 'relative',
      marginBottom: '30px',
    }
  : screens.md
  ? {
      width: '100%',
      height: '150px', // 중간 화면에서 Doughnut 크기 줄이기
      position: 'relative',
      marginBottom: '20px',
    }
  : {
      width: '100%',
      height: '120px', // 작은 화면에서 Doughnut 크기 더 줄이기
      position: 'relative',
      marginBottom: '15px',
    };


  return (
    <div style={containerStyle}>
      <Title level={2} style={{ margin: '0 0 4px 0' }}>
        오늘의 통계
      </Title>
      <Text type="secondary" style={{fontSize:'larger'}}>2024/11/13 11:05:24</Text>

      <Card style={cardStyle}>
        <div style={{ width: '100%', height: '200px', position: 'relative', marginBottom:'30px'}}>
          <Title level={4} style={{ margin: 0 }}>
            이번 달 진행률
          </Title>
          <Doughnut data={data} options={options} />
        </div>

        {hasData ? (
  <ul style={{ padding: 0, marginTop: '20px', listStyle: 'none' }}>
    {['시작 전', '진행 중', '완료', '지연'].map((label, index) => {
      const percentageKey = [
        'beforePercentage',
        'progressPercentage',
        'completePercentage',
        'delayedPercentage',
      ][index] as keyof Statistics; // 타입 캐스팅
      const increaseKey = [
        'beforeIncrease',
        'progressIncrease',
        'completeIncrease',
        'delayedIncrease',
      ][index] as keyof StatisticsResponse;

      const increaseValue = statisticsData?.[increaseKey]; // 값 가져오기

      return (
        <li
          key={index}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '8px',
          }}
        >
          <div>
            <Badge color={badgeStatus[index]} text={label} style={{fontWeight:'bold'}} />
          </div>
          <div
  style={{
    display: 'flex',
    flexDirection: 'row',
    gap: '10px',
    alignItems: 'center', // 세로 가운데 정렬
  }}
>
  {/* % 수치: 오른쪽 정렬 */}
  <p
    style={{
      margin: 0,
      textAlign: 'right',
      flex: 1, // 오른쪽으로 밀려남
    }}
  >
    {statisticsData?.statistics?.[percentageKey] ?? 0}%
  </p>

  {/* 화살표 또는 -: 가운데 정렬 */}
  {screens.xl && typeof increaseValue === 'number' && (
  <p
    style={{
      margin: 0,
      textAlign: 'center',
      width: '20px',
      color:
        increaseValue > 0
          ? '#DB4A26' // 증가 시 빨간색
          : increaseValue < 0
          ? '#0887C9' // 감소 시 파란색
          : '#000', // 동일할 경우 검정색
    }}
  >
    {increaseValue > 0 ? '↑' : increaseValue < 0 ? '↓' : '-'}
  </p>
)}
</div>

        </li>
      );
    })}
          </ul>
        ) : (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Text>현재 등록된 업무가 없습니다.</Text>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Stat;