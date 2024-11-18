import React, { useEffect, useState } from 'react';
import { Input, Select, DatePicker, Table, Typography, Button, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  CalendarOutlined,
  UserOutlined,

} from '@ant-design/icons';

import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import TuneIcon from '@mui/icons-material/Tune';
import { SearchOutlined } from '@mui/icons-material';
import { getUserByProjectId } from "../api/user/getUserByProjectId";
import { searchTask } from "../api/task/searchTask";

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Text, Title } = Typography;
interface SearchProps {
  onSearch: (filters: {
      projectIds: string[];
      itoProcessId: string;
      unit: string;
      assigneeId: string;
      startDate: string;
      dueDate: string;
      taskName: string;
  }) => void;
}

const Search: React.FC<SearchProps> = ({ onSearch }) => {
    const [itoProcessId, setItoProcessId] = useState<string>('');
    const [assigneeId, setAssigneeId] = useState<string>('');
    const [unit, setUnit] = useState<string>('');
    const [startDate, setStartDate] = useState<string>('');
    const [dueDate, setDueDate] = useState<string>('');
    const [taskName, setTaskName] = useState<string>('');

    // userList의 타입을 User[]로 설정
    interface User {
        userId: string;
        name: string;
        // 필요에 따라 추가 속성 정의 가능
      }
    const [userList, setUserList] = useState<User[]>([]);
    

    const userInfo = sessionStorage.getItem("userInfo")
        ? JSON.parse(sessionStorage.getItem("userInfo") as string)
        : null;

    useEffect(() => {
      
        
      if (userInfo && userInfo.projectId) {
        
        const projectIds = userInfo.projectId;
        
        const fetchUsers = async () => {
          try {
            const userListData = await getUserByProjectId(projectIds);
            setUserList(userListData || []);
          } catch (error) {
            console.error("Error fetching users:", error);
          }
        };
        fetchUsers();
        
      }
    }, []);

    const handleSearchClick = () => {
      if (userInfo && userInfo.projectId) {
          const projectIds = userInfo.projectId;
          onSearch({
              projectIds,
              itoProcessId,
              assigneeId,
              unit,
              startDate,
              dueDate,
              taskName,
          });
      }
      
  };

  return (
    <div
      style={{
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px', // 요소 간 간격 조정
        flexWrap: 'wrap',
      }}
    >
      <Select 
    onChange={(value:string) => setItoProcessId(value)} size="large" placeholder="프로세스" style={{ flex: 1, minWidth: '150px' }} allowClear prefix={<AccountTreeOutlinedIcon style={{ fontSize:'16px', color: '#c9c9c9' , verticalAlign: 'middle'}}/>}>
        <Option value="1">리포팅</Option>
        <Option value="2">보안</Option>
        <Option value="3">용량</Option>
        <Option value="4">변경</Option>
        <Option value="5">가용성</Option>
        <Option value="6">감사지원</Option>
        <Option value="7">구성</Option>
        <Option value="8">배포</Option>
      </Select>
      <Select 
      onChange={(value:string) => setUnit(value)} size="large" placeholder="파트" style={{ flex: 1, minWidth: '150px' }} allowClear prefix={<TuneIcon style={{ fontSize:'16px',color: '#c9c9c9' , verticalAlign: 'middle'}}/>}>
        <Option value="OS">OS</Option>
        <Option value="MW">미들웨어</Option>
        <Option value="DB">DB</Option>
        <Option value="NET">네트워크</Option>
        <Option value="SEC">보안</Option>
      </Select>
      <Select 
      onChange={(value:string) => setAssigneeId(value)} size="large" placeholder="담당자" style={{ flex: 1, minWidth: '150px' }} allowClear prefix={<UserOutlined style={{ color: '#c9c9c9' , verticalAlign: 'middle'}}/>} >
      {userList && userList.length > 0 ? (
        <>
        {userList.map((user) => (
          <Option key={user.userId} value={user.userId}>
            {user.name}
          </Option>
        ))}
        </>) : (
          <Option disabled>사용자가 없습니다</Option>
          )}
      </Select>
      <DatePicker 
      onChange={(date, dateString) => setStartDate(dateString.toString())} size="large" placeholder="시작일" style={{ flex: 1, minWidth: '150px' }} prefix={<CalendarOutlined style={{ color: '#c9c9c9' , verticalAlign: 'middle'}}/>} suffixIcon={null}/>
      <DatePicker 
      onChange={(date, dateString) => setDueDate(dateString.toString())} size="large" placeholder="마감일" style={{ flex: 1, minWidth: '150px' }} prefix={<CalendarOutlined style={{ color: '#c9c9c9' , verticalAlign: 'middle'}}/>} suffixIcon={null} />
      <Input 
      onChange={(e) => setTaskName(e.target.value)} size="large" placeholder="업무명" style={{ flex: 2, minWidth: '200px' }} prefix={<SearchOutlined style={{ fontSize:'16px',color: '#c9c9c9' , verticalAlign: 'middle'}}/>}/>
      <Button size="large" type="primary" onClick={handleSearchClick}>
        검색
      </Button>
    </div>
  )
}

export default Search