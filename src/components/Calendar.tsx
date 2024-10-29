import React, { useEffect, useMemo, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction'; // 반드시 추가해야 함
import '../styles/Calendar.css';
import styles from '../styles/Calendar.module.css';
import eventIcon from '../styles/image/eventIcon.png'
import statusComplete from '../styles/image/list/status-complete.svg';
import statusProgress from '../styles/image/list/status-progress.svg';
import statusPending from '../styles/image/list/status-pending.svg';
import { getTaskByMonth } from '../api/getTaskByMonth';

interface Task {
  taskId: number;
  projectId: number;
  taskName: string;
  description: string;
  assigneeId: string;
  createdDate: string;
  startDate: string;
  dueDate: string;
  frequencyId: number;
  commentCount: number;
  status: number;
  itoProcessId: number;
  assigneeConfirmation: string;
}


    // 날짜를 'YYYY-MM-DD' 형식으로 변환하는 함수
const formatDate = (date: Date) => {
    return date.toLocaleDateString('ko-KR').split('T')[0]; // 'YYYY-MM-DD' 형식으로 변환
  };
const Calendar = () => {

  // useState의 타입을 명시적으로 지정
  const [selectedDateEvents, setSelectedDateEvents] = useState<Task[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(formatDate(new Date()));
  const [eventList, setEventList] = useState<Task[]>([]);
  const [currentMonth, setCurrentMonth] = useState('');

  // const handleDatesSet = async (dateInfo: any) => {
  //   const month = dateInfo.view.currentStart.getMonth() + 1;
  //   const year = dateInfo.view.currentStart.getFullYear();
  //   const formattedMonth = `${year}-${month < 10 ? '0' : ''}${month}`;
  //   setCurrentMonth(formattedMonth);

  //   try {
  //     // `getTaskByMonth` 호출하여 데이터를 가져옴
  //     const tasksForMonth = await getTaskByMonth(year, month);
  //     setEventList(tasksForMonth);
  //   } catch (error) {
  //     console.error("Error fetching tasks:", error);
  //   }
  // };

  const handleDatesSet = async (dateInfo: any) => {
    const month = dateInfo.view.currentStart.getMonth() + 1;
    const year = dateInfo.view.currentStart.getFullYear();
    const formattedMonth = `${year}-${month < 10 ? '0' : ''}${month}`;
    setCurrentMonth(formattedMonth);

    try {
      // `getTaskByMonth` 호출하여 데이터를 가져옴
      const tasksForMonth = await getTaskByMonth(year, month);
      setEventList(tasksForMonth || []); // tasksForMonth가 undefined면 빈 배열로 설정
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setEventList([]); // 오류 발생 시 빈 배열로 설정
    }
};

  useEffect(() => {
    const eventsForSelectedDate = eventList.filter(event => event.dueDate === selectedDate);
    setSelectedDateEvents(eventsForSelectedDate);
  }, [selectedDate, eventList]);

    

  const handleDateClick = (info: any) => {
    setSelectedDate(info.dateStr);
    //console.log(selectedDate)
    //const selectedDate = info.dateStr; // 클릭한 날짜 (YYYY-MM-DD 형식)
    const eventsForSelectedDate = eventList.filter(event => event.dueDate === selectedDate);
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
    const dateEvents = eventList.filter(event => formatDate(new Date(event.dueDate as string)) === cellDate); // 해당 날짜의 이벤트 필터링
    
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

  const statusData = [
    { img: statusProgress, label: '진행 중' },
    { img: statusComplete, label: '완료' },
    { img: statusPending, label: '지연' }
];


  return (
    

        <li className={styles.calendarcontainer}>
                            <div className={styles.calendar}>
                              <FullCalendar
                                plugins={[dayGridPlugin, interactionPlugin]} // interactionPlugin을 추가해야 dateClick이 작동함
                                initialView="dayGridMonth"
                                weekends={true}
                                events={eventList}
                                dateClick={handleDateClick} // 날짜 클릭 핸들러
                                headerToolbar={{ // layout header
                                  left: 'prev', 
                                  center: 'title',
                                  right: 'next'
                                }}
                                titleFormat={{ 
                                  month: '2-digit'  // 월을 숫자로 표시 (2자리 숫자)
                                }}
                                eventContent={renderEventContent} // 기본 이벤트 렌더링 비활성화
                                dayCellContent={renderDayCellContent} // 날짜 셀에 이벤트 개수 표시
                                height="auto" // 높이를 자동으로 설정
                                contentHeight="auto" // 콘텐츠 높이를 자동 조정
                                handleWindowResize={true} // 창 크기에 맞게 자동 조정
                                datesSet={handleDatesSet} // datesSet 핸들러 추가
                              />
                            </div>
                            <div className={styles.calendarlist}>
                                <p className={styles.calendardate}>{formatToMMDD(selectedDate)}</p>
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
                                                    <tr key={event.taskId}>
                                                    <td>{event.taskId}</td>
                                                    <td><p>{event.taskName}</p></td>
                                                    
                                                    <td className={styles.status}>
                                                        <img src={statusData[event.status].img} alt=""></img>
                                                        {statusData[event.status].label}
                                                    </td>
                                                    <td>{event.dueDate}</td>                                    
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