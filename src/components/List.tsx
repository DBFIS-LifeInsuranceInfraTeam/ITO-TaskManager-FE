import React, { useEffect, useState } from 'react'
import styles from '../styles/List.module.css';
import statusComplete from '../styles/image/list/status-complete.svg';
import statusProgress from '../styles/image/list/status-progress.svg';
import statusPending from '../styles/image/list/status-pending.svg';
import { useNavigate } from 'react-router-dom';
import { getAllTask } from '../api/getAllTask';

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

const List:React.FC = () => {
    

    const [taskList, setTaskList] = useState<Task[]>([]);
    const [loading, setLoading] = useState<boolean>(true); // 로딩 상태

    useEffect(() => {
      const fetchTaskList = async () => {
        try {
          const data = await getAllTask(); // 백엔드에서 날짜 데이터를 가져옴
          
          setTaskList(data); // 가져온 데이터를 설정
        } catch (err) {
          alert('서버에서 데이터를 가져오지 못했습니다.'); // 에러 메시지 설정
        } finally {
          setLoading(false); // 로딩 상태 해제
        }
      };
  
      fetchTaskList();
    }, []);

    const navigate = useNavigate(); // useNavigate 훅 사용
    
    const handleButtonClick = (taskId:number) => {
    navigate(`/task/detail?taskId=${taskId}`); // 버튼 클릭 시 동적으로 URL 이동
  };

  const statusData = [
    { img: statusProgress, label: '진행 중' },
    { img: statusComplete, label: '완료' },
    { img: statusPending, label: '지연' }
];
  return (
    <>
        <li className={styles.list}>
                        <p>이번 달 할 일</p>
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
                                    <td>{task.assigneeId}</td>
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
                    </li>
    </>
  )
}
export default List