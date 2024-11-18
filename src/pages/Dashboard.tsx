import { Typography, Card ,Layout, Button} from 'antd';
import AddTaskIcon from '@mui/icons-material/AddTask';
import '../styles/pages/Dashboard.css'
import Stat from "../components/Stat";
import TaskList from "../components/List";
import CalendarList from "../components/CalendarList";
import { useNavigate } from "react-router-dom";
import { getAllTask } from "../api/task/getAllTask";
import { useEffect, useState } from "react";
import List from "../components/List";

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
  itoProcessId: number;
  assigneeConfirmation: string;
}

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
                const response = await getAllTask(userInfo.projectId, page, size);
                setTaskList(response.content); // `content`는 응답 데이터의 항목 목록을 포함합니다.
                setTotalPages(response.totalPages); // 전체 페이지 수 설정
                // allTasks가 배열인지 확인
                // const sortedTasks = Array.isArray(allTasks.content)
                //     ? allTasks.sort((a: Task, b: Task) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()).slice(0, 5)
                //     : []; // 배열이 아니면 빈 배열로 설정

                // setTaskList(sortedTasks);
            } catch (error) {
                console.error("Failed to fetch tasks:", error);
            } finally {
                setLoading(false);
            }
        }
        };

        fetchTasks();
    }, []);
    
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
        <Title level={4} style={{ margin:0 }}>업무 리스트</Title>
        <List taskList={taskList} loading={loading} size={5}/>
      </Card>

      {/* 하단 캘린더와 업무 리스트 */}
      <CalendarList/>
      </Content>
    </Layout>
  </Layout>
  )
}

export default Dashboard