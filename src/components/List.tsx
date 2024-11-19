import React from 'react';
import { Table, Avatar, Typography, Tooltip, Skeleton, Tag, Grid } from 'antd';
import '../styles/components/List.css'; // CSS 파일 추가
import StatusTag from './StatusTag';
import { useNavigate } from 'react-router-dom';
const { useBreakpoint } = Grid;

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
  itoProcessId: string;
  assigneeConfirmation: string;
}

interface ListProps {
  taskList: Task[];
  loading: boolean;
  size: number;
}

const List: React.FC<ListProps> = ({ taskList = [], loading, size }) => {
  const navigate = useNavigate();

  const processColors: { [key: string]: string } = {
    리포팅: 'geekblue', // 진한 파랑
    보안: 'orange',      // 주황색
    용량: 'lime',        // 연두색
    변경: 'gold',        // 황금색
    가용성: 'purple',    // 보라색
    감사지원: 'magenta', // 자홍색
    구성: 'cyan',        // 청록색
    배포: 'volcano',     // 화산색 (붉은 주황색)
};

  const processMap: { [key: string]: string } = {
    "1": "리포팅",
    "2": "보안",
    "3": "용량",
    "4": "변경",
    "5": "가용성",
    "6": "감사지원",
    "7": "구성",
    "8": "배포"
};

const screens = useBreakpoint(); // 화면 크기 감지

  const columns = [
      {
        title: 'ITO프로세스',
        dataIndex: 'itoProcessId', // 데이터 매핑 추가
        key: 'itoProcessId',
        align: 'center' as 'center',

        render: (itoProcessId: string) => (
          loading ? (
            <Skeleton.Button active />
          ) : (
            <Tag
              color={processColors[processMap[itoProcessId]] || 'default'} // undefined 방지
              style={{
                padding: '4px 12px',
                margin: '0 12px'
              }}
            >
              {processMap[itoProcessId] || '알 수 없음'}
            </Tag>
          )
        )},
        {
          title: '업무명',
          dataIndex: 'taskName',
          align: 'center' as 'center',
          key: 'taskName',
          render: (taskName: string) => (
            loading ? (
              <Skeleton.Input active />
            ) :
              screens.xl||size===10?(
                <div
                  style={{
                    backgroundColor: '#f5f5f5',
                    borderRadius: '8px',
                    padding: '4px 8px',
                    textAlign: 'center',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: '100%'
                  }}
                >
                  {taskName}
                </div>
              ):(<Tooltip title={taskName}><div
                  style={{
                    backgroundColor: '#f5f5f5',
                    borderRadius: '8px',
                    padding: '4px 8px',
                    textAlign: 'center',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: '150px', // 최대 너비 설정
                  }}
                >
                  {taskName}
                </div>
                </Tooltip>
              )
          ),
        },
        
    {
      title: '담당자',
      dataIndex: 'assignees',
      key: 'assignees',
      align: 'center' as 'center',
      
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
      align: 'center' as 'center',
      
      render: (status: number) => (
        loading ? <Skeleton.Button active  /> : <div>{StatusTag(status)}</div>
      ),
    },
    {
      title: '마감일',
      dataIndex: 'dueDate',
      key: 'dueDate',
      align: 'center' as 'center',
      
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
