import React, { useEffect, useState } from 'react'
import styles from '../styles/Dashboard.module.css';
import Stat from "../components/Stat";
import List from '../components/List';
import btnAdd from '../styles/image/btnAdd.png';
import Calendar from "../components/Calendar";
import { useNavigate } from 'react-router-dom';
import { getAllTask } from "../api/getAllTask";


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

const Dashboard: React.FC = () => {
    
    const navigate = useNavigate();
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
    
  return (
        <div className={styles.content}>
            <Stat/>
            <div className={styles.container}>
                <ul className={styles.dashboard}>
                    <div className={styles.buttonDiv}>
                        {/* debugging 용이니까 나중에 삭제 필요 */}
                        {/* <span>projectID:{userInfo?.projectId}</span> */}
                        <button onClick={() => navigate('/task/add')} className={styles.btnAdd}>
                            <img src={btnAdd} alt=""/>
                            업무 추가하기
                        </button>
                    </div>
                    <List taskList={taskList} loading={loading} />
                    <Calendar/>
                </ul>
            </div>
        </div>
    );
}

export default Dashboard;