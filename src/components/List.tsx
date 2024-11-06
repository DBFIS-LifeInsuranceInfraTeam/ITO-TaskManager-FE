import React from 'react'
import styles from '../styles/List.module.css';
import statusBefore from '../styles/image/list/status-before.svg';
import statusComplete from '../styles/image/list/status-complete.svg';
import statusProgress from '../styles/image/list/status-progress.svg';
import statusPending from '../styles/image/list/status-pending.svg';
import { useNavigate } from 'react-router-dom';

interface Task {
    taskId: string;
    projectId: number;
    taskName: string;
    description: string;
    assigneeId: string;
    assigneeName: string;
    assigneeProfile: string;
    createdDate: string;
    startDate: string;
    dueDate: string;
    frequencyId: number;
    commentCount: number;
    status: number;
    itoProcessId: number;
    assigneeConfirmation: string;
}

interface ListProps {
  taskList: Task[];
  loading: boolean;
}

const List: React.FC<ListProps> = ({ taskList, loading }) => {
    

  // const [taskList, setTaskList] = useState<Task[]>([]);
  // const [loading, setLoading] = useState<boolean>(true); // 로딩 상태
  
  // useEffect(() => {
  //   const fetchTaskList = async () => {
  //     try {
  //       const data = await getAllTask(); // 백엔드에서 데이터 가져옴
  //       setTaskList(data || []); // undefined일 경우 빈 배열로 설정
  //     } catch (err) {
  //       alert('서버에서 데이터를 가져오지 못했습니다.');
  //     } finally {
  //       setLoading(false); // 로딩 상태 해제
  //     }
  //   };
  
  //   fetchTaskList();
  // }, []);
  
  const navigate = useNavigate();
  
  const handleButtonClick = (taskId: string) => {
    navigate(`/task/detail?taskId=${taskId}`);
  };
  
  const statusData = [
    { img: statusBefore, label: '시작 전' },
    { img: statusProgress, label: '진행 중' },
    { img: statusComplete, label: '완료' },
    { img: statusPending, label: '지연' },
  ];
  
  return (
    <>
        <li className={styles.list}>
                        <p>이번 달 할 일</p>
                        {loading ? (
        <p>로딩 중...</p>
      ) : taskList.length === 0 ? (
        <span>등록된 업무가 없습니다.</span> // taskList가 비어있을 때 메시지
      ) : (
                        <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>업무명</th>
                                <th>담당자</th>
                                <th>진행상태</th>
                                <th>마감일</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {taskList.map((task:Task, index:number) => (
                                <tr key={task.taskId}>
                                    <td>{index + 1}</td>
                                    <td><p>{task.taskName}</p></td>
                                    <td className={styles.asignee}>
                                      <img src={`http://backend-service:8080/${task.assigneeProfile}`} alt=""></img>
                                      {task.assigneeName}
                                    </td>
                                    <td className={styles.status}>
                                        <img src={statusData[task.status].img} alt=""></img>
                                        {statusData[task.status].label}
                                    </td>
                                    <td>{task.dueDate}</td>
                                    <td><button onClick={() => handleButtonClick(task.taskId)}>상세</button></td>
                                </tr>
                            ))}
                        </tbody>
                        </table>
      )}
                    </li>
                          
    </>
  )
}
export default List