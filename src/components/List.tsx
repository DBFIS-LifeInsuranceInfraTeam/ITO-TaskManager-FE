import React from 'react';
import { Table, Avatar, Typography, Tooltip, Skeleton } from 'antd';
import '../styles/components/List.css'; // CSS 파일 추가
import StatusTag from './StatusTag';
import { useNavigate } from 'react-router-dom';

const { Text } = Typography;

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

interface ListProps {
  taskList: Task[];
  loading: boolean;
  size: number;
}

const List: React.FC<ListProps> = ({ taskList = [], loading, size }) => {
  const navigate = useNavigate();

  const columns = [
    {
      title: 'No.',
      key: 'index',
      align: 'center' as const,
      width: 40, // 열의 너비를 작게 설정
      render: (_: any, __: any, index: number) => (
        loading ? (
          <Skeleton.Input active style={{ width: '30px', height: '20px' }} />
        ) : (
          <Text>{index + 1}</Text>
        )
      ),
    },
    {
      title: '업무명',
      dataIndex: 'taskName',
      align: 'center' as const,
      key: 'taskName',
      width: 200,
      render: (taskName: string) => (
        loading ? (
          <Skeleton.Input active style={{ width: '150px', height: '20px' }} />
        ) : (
          <div
            style={{
              backgroundColor: '#f5f5f5',
              borderRadius: '8px',
              padding: '4px 8px',
              textAlign: 'center',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {taskName}
          </div>
        )
      ),
    },
    {
      title: '담당자',
      dataIndex: 'assignees',
      key: 'assignees',
      align: 'center' as const,
      width: 150,
      render: (assignees: Assignee[] = []) => {
        if (loading) {
          return <Skeleton.Avatar active size="small" />;
        }
        return assignees.length === 1 ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <Avatar src={assignees[0]?.assigneeProfile} size="small" />
            <Text>{assignees[0]?.assigneeName}</Text>
          </div>
        ) : (
          <Avatar.Group maxCount={2} size="small">
            {assignees.map((assignee, index) => (
              <Tooltip key={index} title={assignee.assigneeName} placement="top">
                <Avatar src={assignee.assigneeProfile} size="small" />
              </Tooltip>
            ))}
          </Avatar.Group>
        );
      },
    },
    {
      title: '진행상태',
      dataIndex: 'status',
      key: 'status',
      align: 'center' as const,
      width: 120,
      render: (status: number) => (
        loading ? <Skeleton.Button active style={{ width: '80px', height: '20px' }} /> : <div>{StatusTag(status)}</div>
      ),
    },
    {
      title: '마감일',
      dataIndex: 'dueDate',
      key: 'dueDate',
      align: 'center' as const,
      width: 120,
      render: (date: string) => (
        loading ? <Skeleton.Input active style={{ width: '100px', height: '20px' }} /> : <Text>{date}</Text>
      ),
    },
  ];

  const handleRowClick = (record: { taskId: string }) => {
    navigate(`/tasks/detail?taskId=${record.taskId}`);
  };

  return (
    

    
    <Table
    dataSource={loading ? Array(size).fill({}) : taskList}
    columns={columns}
    pagination={false}
    rowKey="taskId"
    bordered={false}
    className="custom-table"
    locale={{ emptyText: loading ? <Skeleton active /> : '등록된 업무가 없습니다.' }}
    onRow={(record) => ({
      onClick: () => handleRowClick(record),
    })}
    scroll={{ x: '100%' }} // 테이블 가로 스크롤 활성화
  />
  
  );
};

export default List;
