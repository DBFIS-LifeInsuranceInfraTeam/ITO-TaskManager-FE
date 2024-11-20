import { Avatar, Tag, Typography, Card , Table, Badge, Tooltip, Grid, Skeleton} from 'antd';
import '../styles/pages/Dashboard.css'
import { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction'; // 반드시 추가해야 함
import '../styles/components/CalendarList.css'
import StatusTag from "./StatusTag";
import { useNavigate } from "react-router-dom";
import { getTaskByMonth } from "../api/task/getTaskByMonth";
import React from 'react';
const { useBreakpoint } = Grid;

const { Text, Title } = Typography;


interface Assignee {
    assigneeId: string;
    assigneeName: string;
    assigneeProfile: string;
  }

  
interface Task {
    taskId: string;
    taskName: string;
    assignees: Assignee[];
    dueDate: string;
    commentCount: number;
    status: number;
}

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0]// 'YYYY-MM-DD' 형식으로 변환
  };

  interface ListProps {

    loading: boolean;

  }
  
  const CalendarList: React.FC<ListProps> = ({ loading }) => {

    const navigate = useNavigate(); // navigate 함수 사용
  // useState의 타입을 명시적으로 지정
  const [selectedDateEvents, setSelectedDateEvents] = useState<Task[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(formatDate(new Date()));
  const [eventList, setEventList] = useState<Task[]>([]);
  const [currentMonth, setCurrentMonth] = useState('');


  const screens = useBreakpoint(); // 화면 크기 감지
  
  const columns = [

    //   {
    //     title: '업무명',
    //     dataIndex: 'taskName',
    //     key: 'taskName',
    //     align: 'center' as const,

    //     render: (taskName: string) => (
    //       loading ? (
    //         <Skeleton.Input active />
    //       ) : (
    //         <Tooltip title={taskName}>
    //           <div
    //             style={{
    //               whiteSpace: 'nowrap', // 줄바꿈 방지
    //               textOverflow: 'ellipsis', // 텍스트 생략
    //               overflow: 'hidden', // 넘치는 텍스트 숨김
    //               maxWidth: '100%', // 열 크기에 맞게
    //             }}
    //           >
    //             {taskName}
    //           </div>
    //         </Tooltip>
    //       )
    //     ),
    //   },
    //   {
    //     title: '담당자',
    //     dataIndex: 'assignees',
    //     key: 'assignees',
    //     align: 'center' as const,        
    //     render: (assignees: Assignee[] = []) => {
    //       if (loading) {
    //         return <Skeleton.Avatar active size="small" />;
    //       }
    //       return assignees.length === 1 ? (
    //         <div
    //           style={{
    //             display: 'flex',
    //             alignItems: 'center',
    //             justifyContent: 'center',
    //             gap: '8px',
    //             whiteSpace: 'nowrap', // 줄바꿈 방지
    //           }}
    //         >
    //           <Avatar src={assignees[0]?.assigneeProfile} size="small" />
    //           <Text>{assignees[0]?.assigneeName}</Text>
    //         </div>
    //       ) : (
    //         <Avatar.Group maxCount={2} size="small">
    //           {assignees.map((assignee, index) => (
    //             <Tooltip key={index} title={assignee.assigneeName} placement="top">
    //               <Avatar src={assignee.assigneeProfile} size="small" />
    //             </Tooltip>
    //           ))}
    //         </Avatar.Group>
    //       );
    //     },
    //   },
    //   {
    //     title: '진행상태',
    //     dataIndex: 'status',
    //     key: 'status',
    //     align: 'center' as const,
    //     render: (status: number) => (
    //       loading ? (
    //         <Skeleton.Button active />
    //       ) : (
    //         <div>{StatusTag(status, 'small')}</div>
    //       )
    //     ),
    //   },

    {
      title: '업무명',
      dataIndex: 'taskName',
      align: 'center' as 'center',
      key: 'taskName',
      render: (taskName: string) => (
        loading ? (
          <Skeleton.Button active />
        ) :
          screens.xl?(
            <Tooltip title={taskName}>
            <div
              style={{
                backgroundColor: '#f5f5f5',
                borderRadius: '8px',
                padding: '4px 8px',
                textAlign: 'center',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '100%'
              }}
            >
              {taskName}
            </div>
            </Tooltip>
          ):(<Tooltip title={taskName}><div
              style={{
                backgroundColor: '#f5f5f5',
                borderRadius: '8px',
                padding: '4px 8px',
                textAlign: 'center',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '150px', // 최대 너비 설정
              }}
            >
              {taskName}
            </div>
            </Tooltip>
          )
      ),
    },
    
{
  title: '담당자',
  dataIndex: 'assignees',
  key: 'assignees',
  align: 'center' as 'center',
  
  render: (assignees: Assignee[] = []) => {
    if (loading) {
      return <Skeleton.Avatar active size="small" />;
    }
    return assignees.length === 1 ? (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2px' }}>
        <Avatar src={assignees[0]?.assigneeProfile} size="small" />
        <Text>{assignees[0]?.assigneeName}</Text>
      </div>
    ) : (
      <div style={{display: 'flex',alignItems: 'center', justifyContent: 'center', alignContent:'center'}}>
      <Avatar.Group maxCount={2} size="small">
        {assignees.map((assignee, index) => (
          <Tooltip key={index} title={assignee.assigneeName} placement="top">
            <Avatar src={assignee.assigneeProfile} size="small" />
          </Tooltip>
        ))}
      </Avatar.Group>
      </div>
    );
  },
},
{
  title: '진행상태',
  dataIndex: 'status',
  key: 'status',
  align: 'center' as 'center',
  
  render: (status: number) => (
    loading ? <Skeleton.Button active  /> : <div>{StatusTag(status,"small")}</div>
  ),
},
     ];
    

  
  const handleDatesSet = async (dateInfo: any) => {
    const month = dateInfo.view.currentStart.getMonth() + 1;
    const year = dateInfo.view.currentStart.getFullYear();
    const formattedMonth = `${year}-${month < 10 ? '0' : ''}${month}`;
    setCurrentMonth(formattedMonth);


    const userInfo = sessionStorage.getItem("userInfo")
        ? JSON.parse(sessionStorage.getItem("userInfo") as string)
        : null;

    const projectIds = userInfo ? userInfo.projectId : []; // 유저의 프로젝트 ID 배열 가져오기

    try {
      // `getTaskByMonth` 호출하여 데이터를 가져옴
      const tasksForMonth = await getTaskByMonth(year, month, projectIds);
      setEventList(tasksForMonth || []); // tasksForMonth가 undefined면 빈 배열로 설정
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setEventList([]); // 오류 발생 시 빈 배열로 설정
    }
};


//   useEffect(() => {
//     const eventsForSelectedDate = eventList.filter(event => event.dueDate === selectedDate);

//     setSelectedDateEvents(eventsForSelectedDate);
//   }, [selectedDate, eventList]);

//   useEffect(() => {
//     const transformedEvents = eventList.map(event => ({
//       ...event,
//       dueDate: formatDate(new Date(event.dueDate)), // YYYY-MM-DD 형식으로 변환
//     }));
//     setEventList(transformedEvents);
//   }, [eventList]);
  
useEffect(() => {
    console.log(eventList)
    const eventsForSelectedDate = eventList.filter(event => event.dueDate === selectedDate);
    
    setSelectedDateEvents(eventsForSelectedDate);
  }, [selectedDate, eventList]);


const handleDateClick = (info: any) => {
  setSelectedDate(info.dateStr);
  
  
  //const selectedDate = info.dateStr; // 클릭한 날짜 (YYYY-MM-DD 형식)
  const eventsForSelectedDate = eventList.filter(event => event.dueDate === selectedDate);
  console.log(eventsForSelectedDate)
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
    <div
      style={{
        textAlign: 'center',
        minHeight: '50px', // 최소 높이 설정
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center', // 수직 가운데 정렬
        alignItems: 'center', // 수평 가운데 정렬
      }}
    >
      <p style={{ cursor: 'pointer', marginBottom: '4px' }}>{cellInfo.dayNumberText}</p> {/* 날짜 표시 */}
      <div style={{ visibility: eventCount > 0 ? 'visible' : 'hidden', whiteSpace:'nowrap'}}>
        {/* 이벤트 개수 표시 또는 공간 유지 */}
        <Badge key={'pink'} color={'pink'} text={eventCount > 1 ? `+${eventCount}` : ''} />
        {/* <span style={{ color: '#000000', fontSize: '0.8em' }}>{eventCount > 0 ? `+${eventCount}` : ''}</span> */}
      </div>
    </div>
  );
};

// 이벤트를 렌더링하지 않도록 처리
const renderEventContent = () => {
  return null; // 이벤트 제목을 숨기고 커스텀 렌더링 비활성화
};

  // 행 클릭 이벤트 처리 함수
  const handleRowClick = (record: { taskId: string }) => {
    navigate(`/tasks/detail?taskId=${record.taskId}`); // 해당 taskId로 이동
  };


  return (
    <Card style={{boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',padding: '8px' }}>
     <div style={{ display: 'flex', gap: '40px', height: '100%' ,width: '100%'}}>
    
     <div style={{ flex: 1, 
  display: 'flex',
    flexDirection: 'column',width: '100%', height: '100%',
    boxSizing: 'border-box', 
    overflow: 'hidden'}}>
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      weekends={true}
      events={eventList}
      dateClick={handleDateClick}
      headerToolbar={{
        left: 'prev',
        center: 'title',
        right: 'next',
      }}
      titleFormat={{
        month: '2-digit',
      }}
      eventContent={renderEventContent}
      dayCellContent={renderDayCellContent}
      height="auto" // 높이를 자동으로 설정
      contentHeight="auto" // 콘텐츠 높이를 자동 조정
      handleWindowResize={true} // 창 크기에 맞게 자동 조정
      datesSet={handleDatesSet}
      timeZone="UTC" 
      initialDate={new Date().toISOString()} // 현재 날짜로 캘린더 초기화
    nowIndicator={true} // 오늘 날짜 표시
    />
  </div>

  <div style={{ flex: 1, display: 'flex',
    flexDirection: 'column',width: '100%', height: '100%',
    boxSizing: 'border-box', 
    overflow: 'hidden'}}>
    <Title level={4} style={{margin: '0 0 5px 0'}}>
    {formatToMMDD(selectedDate)}
    </Title>
    <div
        style={{
        maxHeight: '400px', // 스크롤 가능한 최대 높이 설정
        display: 'flex',
        minWidth: '100%', // 최소 너비 설정
        overflowY: 'auto', // 세로 스크롤 활성화
        }}
    >
        

      <Table
        dataSource={selectedDateEvents}
        columns={columns}
        pagination={false}
        rowKey="taskId"
        bordered={false}
        className="custom-table"
        locale={{ emptyText: '등록된 업무가 없습니다.' }} // 데이터가 없을 때 표시할 메시지
        onRow={(record) => ({
            onClick: () => handleRowClick(record), // 행 클릭 시 이벤트 호출
          })}
          scroll={{ x: '100%' }} 
        style={{ minWidth: '100%' }} // 테이블 최소 너비 보장
        tableLayout="fixed" // 열 너비 고정
      /> 

    </div>
    </div>
  </div>
 
</Card>

  )
}

export default CalendarList