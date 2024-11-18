import React, { useEffect, useState } from 'react';
import { Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';

import Search from '../components/Search';
import List from '../components/List';
import { getAllTask } from "../api/task/getAllTask";
import { searchTask } from "../api/task/searchTask";
import { Pagination } from "@mui/material";

const { Title } = Typography;

// // 더미 데이터
// const tasks = Array.from({ length: 50 }, (_, index) => ({
//   id: index + 1,
//   taskName: `업무 ${index + 1}`,
//   assignee: `담당자 ${index + 1}`,
//   process: `프로세스 ${index % 3 + 1}`,
//   part: `파트 ${index % 5 + 1}`,
//   startDate: '2024-11-01',
//   dueDate: '2024-11-30',
// }));


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


const TaskList: React.FC = () => {
  const [taskList, setTaskList] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1); // MUI Pagination은 1부터 시작
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

  const userInfo = sessionStorage.getItem('userInfo')
    ? JSON.parse(sessionStorage.getItem('userInfo') as string)
    : null;

    const sortTasksByDueDate = (tasks: Task[]) => {
      return tasks.sort((a, b) => {
        const dateA = new Date(a.dueDate).getTime();
        const dateB = new Date(b.dueDate).getTime();
        return dateA - dateB; // 마감일 기준 오름차순 정렬
      });
    };

  const fetchTasks = async (page: number, size: number) => {
    if (!userInfo || !userInfo.projectId) return;

    setLoading(true);
    try {
      const response = await getAllTask(userInfo.projectId, page - 1, size); // MUI 페이지는 1부터 시작, API는 0부터

      console.log(response)
      const sortedTasks = sortTasksByDueDate(response.content); // 정렬된 데이터
      setTaskList(sortedTasks);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilteredTasks = async () => {
    setLoading(true);
    try {
      const result = await searchTask(
        { ...filters, projectIds: userInfo.projectId },
        page - 1,
        size
      ); // MUI 페이지는 1부터 시작, API는 0부터
      if (!result || !result.content || result.content.length === 0) {
        // 204 No Content 혹은 데이터가 없을 경우 처리
        setTaskList([]); // 빈 배열 할당
        setTotalPages(0); // 총 페이지를 0으로 설정
    } else {
        const sortedTasks = sortTasksByDueDate(result.content); // 마감일 기준 정렬된 데이터
        setTaskList(sortedTasks);
        setTotalPages(result.totalPages || 0); // 총 페이지 정보 설정
    }
    } catch (error) {
      console.error('Failed to search tasks:', error);
        setTaskList([]); // 오류 시에도 빈 배열로 초기화
        setTotalPages(0);
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
    setPage(1); // 검색 조건이 변경되면 페이지를 첫 페이지로 초기화
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage); // 페이지 상태 업데이트
  };

  return (
    <div
      style={{
        padding: '40px 100px',
        backgroundColor: '#fff',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      <Title level={3} style={{ margin: 0 }}>
        업무 조회
      </Title>

      <Search onSearch={handleSearch} />
      {/* 테이블 */}
      <List taskList={taskList} loading={loading} size={10} />

      {taskList.length === 0 && !loading ? (
      <>
      </>
  ) : (
    <div style={{display:'flex', width:'100%', justifyContent:'center'}}>
        <Pagination
          count={totalPages} // 총 페이지 수
          page={page} // 현재 페이지
          sx={{
            '& .MuiPaginationItem-root': {
              '&.Mui-selected': {
                backgroundColor: '#006AFF', // 선택된 페이지의 배경색
                color: '#fff', // 선택된 페이지의 텍스트 색상
              },
            },
          }}
        
          onChange={handlePageChange} // 페이지 변경 핸들러
          
        />
      </div>
  )}
    
    </div>
  );
};

export default TaskList;