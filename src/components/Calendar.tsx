import React, { useEffect, useMemo, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction'; // 반드시 추가해야 함
import '../styles/Calendar.css';
import styles from '../styles/Calendar.module.css';
import { EventInput } from '@fullcalendar/core'; // FullCalendar 이벤트 타입
import eventIcon from '../styles/image/eventIcon.png'
import statusComplete from '../styles/image/list/status-complete.svg';
import statusProgress from '../styles/image/list/status-progress.svg';
import statusPending from '../styles/image/list/status-pending.svg';

interface Event {
    id: string;
    name: string;
    manager: string;
    status: string;
    deadline: string; 
    statusColor: any;
  }


    // 날짜를 'YYYY-MM-DD' 형식으로 변환하는 함수
const formatDate = (date: Date) => {
    return date.toLocaleDateString('ko-KR').split('T')[0]; // 'YYYY-MM-DD' 형식으로 변환
  };
const Calendar = () => {

  // useState의 타입을 명시적으로 지정
  const [selectedDateEvents, setSelectedDateEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(formatDate(new Date()));


  const events: Event[] = useMemo(
    () => [
        { id: '01', name: 'SAS 라이센스 교체', manager: '김소연', status: '완료', deadline: '2024-10-01', statusColor: statusComplete },
        { id: '02', name: '주간보고서 작성', manager: '이규빈', status: '진행 중', deadline: '2024-10-20', statusColor: statusProgress },
        { id: "03", name: 'WAS 버전 업그레이드', manager: '변유석', status: '진행 중', deadline: '2024-10-21', statusColor: statusProgress },
        { id: "04", name: 'SAS 라이센스 교체', manager: '김소연', status: '지연', deadline: '2024-10-25', statusColor: statusPending },
        { id: "05", name: '주간보고서 작성', manager: '변유석', status: '지연', deadline: '2024-10-25', statusColor: statusPending }
    ],
    [] // 이 배열은 한 번만 생성됨
  );

  useEffect(() => {
    //console.log(selectedDate); // 최신 selectedDate 값을 출력
    const eventsForSelectedDate = events.filter(event => event.deadline === selectedDate);
    setSelectedDateEvents(eventsForSelectedDate);
   console.log(selectedDateEvents)
  }, [selectedDate, events]); // selectedDate가 변경될 때 실행
  
  

  const handleDateClick = (info: any) => {
    setSelectedDate(info.dateStr);
    //console.log(selectedDate)
    //const selectedDate = info.dateStr; // 클릭한 날짜 (YYYY-MM-DD 형식)
    const eventsForSelectedDate = events.filter(event => event.deadline === selectedDate);
    setSelectedDateEvents(eventsForSelectedDate);
  };

  

// 날짜를 'MM/DD' 형식으로 변환하는 함수
const formatToMMDD = (date: string) => {
    //return new Date(date).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' }); // 'MM/DD/YYYY' 형식
    return new Date(date)
    .toLocaleDateString('ko-KR', {
      month: '2-digit',
      day: '2-digit',
      weekday: 'short', // 요일을 짧은 형식으로 표시
    }).replace(/\.\s/g, '/') // '.' 뒤의 공백을 '/'로 변경
    .replace(/\/\(/g, ' ('); // 요일 앞의 불필요한 '/' 제거
    
  };

  // 날짜 셀에 이벤트 개수 표시
  const renderDayCellContent = (cellInfo: any) => {
    const cellDate = formatDate(new Date(cellInfo.date)); // 'YYYY-MM-DD' 형식으로 변환
    const dateEvents = events.filter(event => formatDate(new Date(event.deadline as string)) === cellDate); // 해당 날짜의 이벤트 필터링
    const eventCount = dateEvents.length; // 이벤트 개수

    return (
      <div style={{ textAlign: 'center'}}>
        <p style={{cursor: 'pointer'}}>{cellInfo.dayNumberText}</p> {/* 날짜 표시 */}
        {eventCount > 0 && (
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        <img src={eventIcon} alt="" style={{ margin:'auto', verticalAlign: 'middle', display: 'block' }} />
        <span style={{ color: '#000000', fontSize:'0.8em' }}>+{eventCount}</span> {/* 이벤트 개수 표시 */}
      </div>
        )}
      </div>
    );
  };



  // 이벤트를 렌더링하지 않도록 처리
  const renderEventContent = () => {
    return null; // 이벤트 제목을 숨기고 커스텀 렌더링 비활성화
  };


  return (
    

        <li className={styles.calendarcontainer}>
                            <div className={styles.calendar}>
                            <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]} // interactionPlugin을 추가해야 dateClick이 작동함
        initialView="dayGridMonth"
        weekends={true}
        events={events}
        dateClick={handleDateClick} // 날짜 클릭 핸들러
        headerToolbar={{ // layout header
          left: 'prev', 
          center: 'title',
          right: 'next'
        }}
        titleFormat={{ 
          month: '2-digit'  // 월을 숫자로 표시 (2자리 숫자)
        }}
        height='auto'
        eventContent={renderEventContent} // 기본 이벤트 렌더링 비활성화
        dayCellContent={renderDayCellContent} // 날짜 셀에 이벤트 개수 표시
      />
                            </div>
                            <div className={styles.calendarlist}>
                                <h2>{formatToMMDD(selectedDate)}</h2>
                                {selectedDateEvents.length > 0 ? (
                                    // <ul>
                                    //     {selectedDateEvents.map((event, index) => (
                                    //         <li key={index}>{event.title}</li> // 선택한 날짜의 이벤트 목록 출력
                                    //         ))}
                                    // </ul>
                                    <table className={styles.table}>
                                        <thead>
                                            <tr>
                                                <th>No.</th>
                                                <th>업무명</th>
                                                <th>진행상태</th>
                                                <th>마감일</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedDateEvents.map((event) => (
                                                    <tr key={event.id}>
                                                    <td>{event.id}</td>
                                                    <td><p>{event.name}</p></td>
                                                    
                                                    <td className={styles.status}>
                                                        <img src={event.statusColor} alt=""></img>
                                                        {event.status}
                                                    </td>
                                                    <td>{event.deadline}</td>                                    
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    ) : (
                                            <p>등록된 업무가 없습니다.</p> // 이벤트가 없을 경우 메시지 출력
                                    )}
                                
                            </div>
                    </li>
  )
}

export default Calendar