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
//   const [taskList, setTaskList] = useState<Task[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [page, setPage] = useState<number>(0); // 현재 페이지 상태
//   const [totalPages, setTotalPages] = useState<number>(0); // 전체 페이지 수 상태
//   const [size, setSize] = useState<number>(10); // 페이지당 항목 수 상태

  

//   const userInfo = sessionStorage.getItem("userInfo")
//     ? JSON.parse(sessionStorage.getItem("userInfo") as string)
//     : null;

//   const fetchTasks = async (page: number, size: number) => {
//     if (!userInfo || !userInfo.projectId) return;
    
//     setLoading(true);
//     try {
//       const response = await getAllTask(userInfo.projectId, page, size);
//       setTaskList(response.content); // `content`는 응답 데이터의 항목 목록을 포함합니다.
//       setTotalPages(response.totalPages); // 전체 페이지 수 설정
//       //setTaskList(allTasks);
//     } catch (error) {
//       console.error("Failed to fetch tasks:", error);
//     } finally {
//       setLoading(false);
//     }
//   };


//   useEffect(() => {
//     fetchTasks(page, size);
//   }, [page, size]);

//   const handleSearch = async (filters: {
//     projectIds?: string[];
//     itoProcessId?: string;
//     unit?: string;
//     assigneeId?: string;
//     startDate?: string;
//     dueDate?: string;
//     taskName?: string;
//   }) => {
//     const adjustedFilters = {
//       projectIds: userInfo.projectId || [], // 기본값을 빈 배열로 설정
//       itoProcessId: filters.itoProcessId || "",
//       unit: filters.unit || "",
//       assigneeId: filters.assigneeId || "",
//       startDate: filters.startDate || "",
//       dueDate: filters.dueDate || "",
//       taskName: filters.taskName || ""
//     };

//     // 모든 필터가 비어있는지 확인하는 로직
//     const isFilterEmpty = adjustedFilters.projectIds.length === 0 
//     && !adjustedFilters.itoProcessId 
//     && !adjustedFilters.unit 
//     && !adjustedFilters.assigneeId 
//     && !adjustedFilters.startDate 
//     && !adjustedFilters.dueDate 
//     && !adjustedFilters.taskName;
//     setLoading(true);
//     try {
//       if (isFilterEmpty) {
//         // 필터가 없을 때 전체 데이터 호출
//         await fetchTasks(page, size);
//       } else {
//         // 필터가 있을 때 필터링된 데이터 호출
//         const result = await searchTask(adjustedFilters, page, size);
//         setTaskList(result.content);
//         setTotalPages(result.totalPages);
//       }
//     } catch (error) {
//       console.error("Failed to search tasks:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePageChange = (newPage: number) => {
//     setPage(newPage); // 페이지 변경 시 상태 업데이트
//   };

//   return (
//     <div className={styles.container}>
//       <Search onSearch={handleSearch} />
//       <List taskList={taskList} loading={loading} />


//       {/* 페이지네이션 버튼 */}
// <div className={styles.pagination}>
//     <button 
//         disabled={page === 0} 
//         onClick={() => handlePageChange(page - 1)}
//     >
//         {'<'}
//     </button>
//     {Array.from({ length: totalPages }, (_, i) => (
//         <button 
//             key={i} 
//             className={i === page ? styles.active : ''} // 현재 페이지에만 'active' 클래스 추가
//             onClick={() => handlePageChange(i)}
//         >
//             {i + 1}
//         </button>
//     ))}
//     <button 
//         disabled={page === totalPages - 1} 
//         onClick={() => handlePageChange(page + 1)}
//     >
//         {'>'}
//     </button>
// </div>

//     </div>
//   );
// };

// export default TaskList;
const [taskList, setTaskList] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [size, setSize] = useState<number>(10);
  const [filters, setFilters] = useState<{
    projectIds?: string[];
    itoProcessId?: string;
    unit?: string;
    assigneeId?: string;
    startDate?: string;
    dueDate?: string;
    taskName?: string;
  }>({});

  const userInfo = sessionStorage.getItem("userInfo")
    ? JSON.parse(sessionStorage.getItem("userInfo") as string)
    : null;

  const fetchTasks = async (page: number, size: number) => {
    if (!userInfo || !userInfo.projectId) return;

    setLoading(true);
    try {
      const response = await getAllTask(userInfo.projectId, page, size);
      setTaskList(response.content);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilteredTasks = async () => {
    setLoading(true);
    try {
      const result = await searchTask({ ...filters, projectIds: userInfo.projectId }, page, size);
      setTaskList(result.content);
      setTotalPages(result.totalPages);
    } catch (error) {
      console.error("Failed to search tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (Object.keys(filters).length === 0) {
      fetchTasks(page, size);
    } else {
      fetchFilteredTasks();
    }
  }, [page, size, filters]);

  const handleSearch = async (newFilters: {
    projectIds?: string[];
    itoProcessId?: string;
    unit?: string;
    assigneeId?: string;
    startDate?: string;
    dueDate?: string;
    taskName?: string;
  }) => {
    setFilters(newFilters);
    setPage(0); // 검색 조건이 변경되면 페이지를 첫 페이지로 초기화
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className={styles.container}>
      <Search onSearch={handleSearch} />
      <List taskList={taskList} loading={loading} />

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
            className={i === page ? styles.active : ''} 
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
