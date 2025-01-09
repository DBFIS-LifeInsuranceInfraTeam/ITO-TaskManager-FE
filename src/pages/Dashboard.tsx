import { Typography, Card ,Layout, Button, Tooltip} from 'antd';
import AddTaskIcon from '@mui/icons-material/AddTask';
import '../styles/pages/Dashboard.css'
import Stat from "../components/Stat";
import {toast} from "react-toastify";
import CalendarList from "../components/CalendarList";
import { useNavigate } from "react-router-dom";
import { getAllTask } from "../api/task/getAllTask";
import { useEffect, useState } from "react";
import List from "../components/List";
import dayjs from 'dayjs';
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import {ExclamationCircleOutlined} from '@ant-design/icons';
import { getTaskByMonth } from '../api/task/getTaskByMonth';

const { Content } = Layout;
const { Title } = Typography;

interface Assignee {
  assigneeId: string;
  assigneeName: string;
  assigneeProfile: string;
}
interface Task {
  taskId: string;
  projectId: number;
  taskName: string;
  description: string;
  assignees: Assignee[];
  createdDate: string;
  startDate: string;
  dueDate: string;
  frequencyId: number;
  commentCount: number;
  status: number;
  itoProcessId: string;
  assigneeConfirmation: string;
}

// 플러그인 등록
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const Dashboard = () => {
    
  const navigation = useNavigate();
  const goToAddTaskPage = () => {
    navigation('/tasks/add');
  }


  
    const [taskList, setTaskList] = useState<Task[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [page, setPage] = useState<number>(0); // 현재 페이지 상태
    const [totalPages, setTotalPages] = useState<number>(0); // 전체 페이지 수 상태
    const [size, setSize] = useState<number>(5); // 페이지당 항목 수 상태

    const userInfo = sessionStorage.getItem("userInfo")
      ? JSON.parse(sessionStorage.getItem("userInfo") as string)
      : null;


      useEffect(() => {
        const userInfo = sessionStorage.getItem("userInfo")
          ? JSON.parse(sessionStorage.getItem("userInfo") as string)
          : null;
    
        const fetchTasks = async () => {
          if (userInfo && Array.isArray(userInfo.projectId)) {
            try {
              // const response = await getAllTask(userInfo.projectId, page, 40);
    
              
              // // 현재 달의 시작일과 종료일 계산
              // const today = dayjs();
              // const currentMonthStart = today.startOf('month');
              // const currentMonthEnd = today.endOf('month');

              // console.log(today)
              // console.log(currentMonthStart)
              // console.log(currentMonthEnd)
              // // 이번 달 필터링
              // const filteredTasks = response.content.filter((task: Task) => {
              //   const dueDate = dayjs(task.dueDate);
              //   console.log(task.dueDate)
              //   return dueDate.isSameOrAfter(currentMonthStart) && dueDate.isSameOrBefore(currentMonthEnd);
              // });
    
              
              
    
              const response = await getTaskByMonth(dayjs().year(), dayjs().month()+1,userInfo.projectId);
              // 마감일 기준 정렬 후 상위 5개 추출

              console.log(response)
              const sortedTasks = response
                .sort((a, b) => dayjs(a.dueDate).diff(dayjs(b.dueDate)))
                .slice(0, 5);
              setTaskList(sortedTasks);
              setTotalPages(response.totalPages);
            } catch (error) {
              //console.error("Failed to fetch tasks:", error);
              toast.error('업무를 불러오는데 실패했습니다.')
            } finally {
              setLoading(false);
            }
          }
        };
    
        fetchTasks();
    }, [page, size]);
    
  //전체업무에서 사용자가 속한 프로젝트들의 업무 중 마감일 임박한 5개 업무 가져오기

  //기본 일자는 오늘, calendar에서 날짜 선택하면 마감일 기준 해당 날짜의 업무 리스트 조회

  return (
    <Layout style={{ minHeight: '100vh', display: 'flex', flexDirection:'row'  }}>
    {/* 왼쪽 고정 영역 */}
    <Stat/>

    {/* 오른쪽 컨텐츠 영역 */}
    <Layout style={{ flex: 1,  overflowY: 'auto' }}>
      <Content
        style={{
          padding: '20px 40px',
          backgroundColor: '#fff',
          minHeight: '100vh',
          display: 'flex',
          overflowY: 'auto',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        
      {/* 상단 버튼 */}
      <div style={{ textAlign: 'right'}}>
              <Button
              size="large"
                type="primary"
                icon={<AddTaskIcon />}
                style={{ marginRight: '8px' }}
                onClick={goToAddTaskPage}
              >
                업무 추가하기
              </Button>
            </div>
      
      {/* 상단 업무 리스트 */}
      <Card style={{ flex: 1, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'}}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    <Title level={4} style={{ margin: 0, display: 'flex', alignItems: 'center' }}>
      업무 리스트
      <Tooltip title="이번 달 마감일 기준 상위 5개 업무입니다.">
        <ExclamationCircleOutlined  style={{ fontSize: '12px', marginLeft: '8px', color: '#999', cursor: 'pointer' }} />
      </Tooltip>
    </Title>
  </div>
        
        <List taskList={taskList} loading={loading} size={5}/>
      </Card>

      {/* 하단 캘린더와 업무 리스트 */}
      <CalendarList loading={loading}/>
      </Content>
    </Layout>
  </Layout>
  )
}

export default Dashboard