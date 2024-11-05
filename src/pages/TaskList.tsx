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

const TaskList: React.FC = () => {
  const [taskList, setTaskList] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(0); // 현재 페이지 상태
  const [totalPages, setTotalPages] = useState<number>(0); // 전체 페이지 수 상태
  const [size, setSize] = useState<number>(3); // 페이지당 항목 수 상태

  

  const userInfo = sessionStorage.getItem("userInfo")
    ? JSON.parse(sessionStorage.getItem("userInfo") as string)
    : null;

  const fetchTasks = async (page: number, size: number) => {
    if (!userInfo || !userInfo.projectId) return;
    
    setLoading(true);
    try {
      const response = await getAllTask(userInfo.projectId, page, size);
      setTaskList(response.content); // `content`는 응답 데이터의 항목 목록을 포함합니다.
      setTotalPages(response.totalPages); // 전체 페이지 수 설정
      //setTaskList(allTasks);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchTasks(page, size);
  }, [page, size]);

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
        await fetchTasks(page,size); // 전체 리스트를 가져오는 함수 호출
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

  const handlePageChange = (newPage: number) => {
    setPage(newPage); // 페이지 변경 시 상태 업데이트
  };

  return (
    <div className={styles.container}>
      <Search onSearch={handleSearch} />
      <List taskList={taskList} loading={loading} />


      {/* 페이지네이션 버튼 */}
<div className={styles.pagination}>
    <button 
        disabled={page === 0} 
        onClick={() => handlePageChange(page - 1)}
    >
        {'<'}
    </button>
    {Array.from({ length: totalPages }, (_, i) => (
        <button 
            key={i} 
            className={i === page ? styles.active : ''} // 현재 페이지에만 'active' 클래스 추가
            onClick={() => handlePageChange(i)}
        >
            {i + 1}
        </button>
    ))}
    <button 
        disabled={page === totalPages - 1} 
        onClick={() => handlePageChange(page + 1)}
    >
        {'>'}
    </button>
</div>

    </div>
  );
};

export default TaskList;
