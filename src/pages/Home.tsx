import React, { useEffect, useState } from 'react';
import { getDate } from '../api/getDate';
import '../styles/Home.css'

const Home: React.FC = () => {
  const [date, setDate] = useState<any>(null); // 날짜 데이터를 저장할 상태
  const [loading, setLoading] = useState<boolean>(true); // 로딩 상태
  const [error, setError] = useState<string | null>(null); // 에러 메시지 저장

  // 컴포넌트가 로딩될 때 getDate 호출
  useEffect(() => {
    const fetchDate = async () => {
      try {
        const data = await getDate();
        setDate(data);
      } catch (err) {
        setError('Failed to fetch date'); // 에러 메시지 설정
      } finally {
        setLoading(false); // 로딩 상태 해제
      }
    };

    fetchDate(); // API 호출 함수 실행
  }, []); // 빈 배열 넘겨 컴포넌트 렌더링 시 한 번만 호출

  // 로딩 중일 때
  if (loading) {
    return <div>Loading...</div>;
  }

  // 에러가 발생한 경우
  if (error) {
    return <div>{error}</div>;
  }

  // 로딩이 끝난 후 데이터가 있을 때
  return (
    <div>
      <h1>{date.year}.{date.month}.{date.day} {date.hour}:{date.minute}:{date.second}</h1>
    </div>
  );
};

export default Home;