import React, { useEffect, useState } from 'react';
import { getDate } from '../api/getDate';
import styles from '../styles/Home.module.css';
import { useLocation } from 'react-router-dom';

const Home: React.FC = () => {
    const [date, setDate] = useState<{ year: number; month: number; day: number; hour: number; minute: number; second: number } | null>(null); // 날짜 데이터 구조화
    const [loading, setLoading] = useState<boolean>(true); // 로딩 상태
    const [error, setError] = useState<string | null>(null); // 에러 메시지 저장

    const location = useLocation();
    const userData = location.state?.userData; // 전달된 userData를 가져옵니다

    useEffect(() => {
        const fetchDate = async () => {
            try {
                const data = await getDate();
                setDate(data);
            } catch (err) {
                setError('현재 시간을 가져오는 데 실패했습니다.'); // 에러 메시지 설정
            } finally {
                setLoading(false); // 로딩 상태 해제
            }
        };

        fetchDate(); // 처음 로딩 시 데이터 가져오기

        // 10초마다 fetchDate 호출
        const intervalId = setInterval(fetchDate, 10000);

        // 컴포넌트가 언마운트될 때 인터벌 정리
        return () => clearInterval(intervalId);
    }, []); // 빈 배열 넘겨 컴포넌트 렌더링 시 한 번만 호출

    // 로딩 중일 때
    if (loading) {
        return <div className={styles.home}>Loading...</div>;
    }

    // 에러가 발생한 경우
    if (error) {
        return <div className={styles.home}>{error}</div>;
    }

    // 로딩이 끝난 후 데이터가 있을 때
    return (
        <div className={styles.home}>
            {userData ? (
                <h1>환영합니다, {userData.name}님!</h1> // 예시로 username을 표시
            ) : (
                <h1>환영합니다!</h1>
            )}
            {date && ( // date가 존재할 때만 표시
                <h1>
                    {date.year}.{date.month}.{date.day} {date.hour}:{date.minute}:{date.second}
                </h1>
            )}
        </div>
    );
};

export default Home;