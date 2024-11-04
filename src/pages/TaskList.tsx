import React, { useEffect, useState } from 'react'
import styles from '../styles/TaskList.module.css';
import List from '../components/List';
import Search from '../components/Search';
import { getAllTask } from "../api/getAllTask";
import { searchTask } from "../api/searchTask";


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

const TaskList: React.FC = () => {
  const [taskList, setTaskList] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const userInfo = sessionStorage.getItem("userInfo")
    ? JSON.parse(sessionStorage.getItem("userInfo") as string)
    : null;

  const fetchTasks = async () => {
    if (!userInfo || !userInfo.projectId) return;
    
    setLoading(true);
    try {
      const allTasks = await getAllTask(userInfo.projectId);
      setTaskList(allTasks);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSearch = async (filters: {
    itoProcessId?: string;
    assigneeId?: string;
    startDate?: string;
    dueDate?: string;
    taskName?: string;
  }) => {
    const adjustedFilters = {
      itoProcessId: filters.itoProcessId || "",
      assigneeId: filters.assigneeId || "",
      startDate: filters.startDate || "",
      dueDate: filters.dueDate || "",
      taskName: filters.taskName || ""
    };

    const isFilterEmpty = !adjustedFilters.itoProcessId && !adjustedFilters.assigneeId && 
                          !adjustedFilters.startDate && !adjustedFilters.dueDate && !adjustedFilters.taskName;

    setLoading(true);
    try {
      if (isFilterEmpty) {
        await fetchTasks(); // 전체 리스트를 가져오는 함수 호출
      } else {
        const result = await searchTask(adjustedFilters);
        setTaskList(result);
      }
    } catch (error) {
      console.error("Failed to search tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Search onSearch={handleSearch} />
      <List taskList={taskList} loading={loading} />
    </div>
  );
};

export default TaskList;
