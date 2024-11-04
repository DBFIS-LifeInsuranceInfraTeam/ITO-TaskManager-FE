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
                const allTasks = await getAllTask(userInfo.projectId);
                // allTasks가 배열인지 확인
                const sortedTasks = Array.isArray(allTasks)
                    ? allTasks.sort((a: Task, b: Task) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()).slice(0, 5)
                    : []; // 배열이 아니면 빈 배열로 설정

                setTaskList(sortedTasks);
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
                        <span>projectID:{userInfo?.projectId}</span>
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