import React, { useEffect, useState } from 'react';
import { Card, Tag, Avatar, Input, Button, Space, Typography, List, Popconfirm, Tooltip, Modal } from 'antd';
import {
    CalendarOutlined,
    UserOutlined,
    FileTextOutlined,
    MessageOutlined,
    EditOutlined,
    DeleteOutlined,
    CheckOutlined,
    HeartFilled,
    HeartOutlined,
    SyncOutlined, 
    FlagOutlined
} from '@ant-design/icons';

import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StatusTag from '../components/StatusTag';
import { useLocation, useNavigate } from 'react-router-dom';
import { deleteComment } from "../api/comment/deleteComment";
import { addComment } from "../api/comment/addComment";
import { addLiketoComment } from "../api/comment/addLiketoComment";
import { deleteTask } from "../api/task/deleteTask";
import { toast } from "react-toastify";
import { getTaskById } from "../api/task/getTaskById";
import dayjs from "dayjs";
import { updateTaskStatus } from '../api/task/updateTaskStatus';
import { deleteRelatedTasks } from "../api/task/deleteRelatedTasks";

const { TextArea } = Input;
const { Title, Text } = Typography;

interface Assignee {
    assigneeId: string;
    assigneeName: string;
    assigneeProfile: string;
  }
interface Task {
    createdBy: string;
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
    status: 0 | 1 | 2 | 3; // 진행 상태는 0~3으로 제한
    itoProcessId: string;
    assigneeConfirmation: string;
    recurring: boolean;
  }
  
  
  interface Comment {
    commentId: bigint;
    commenter: {
        commenterId: string;
        commenterName: string;
        commenterProfile: string;
    }
    commentContent: string;
    createDate: string;
    likeCount: number;
    likedUsers: string[];
  }

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

const DetailTask: React.FC = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const taskId = searchParams.get('taskId');
    const [task, setTask] = useState<Task | undefined>(undefined);
    const [error, setError] = useState<string | null>(null);
    const [commentList, setCommentList] = useState<Comment[]>([]);
    const [commentContent, setCommentContent] = useState<string>('');
    const userInfo = sessionStorage.getItem("userInfo")
        ? JSON.parse(sessionStorage.getItem("userInfo") as string)
        : null;

    useEffect(() => {
        if (taskId) {
            const fetchData = async () => {
                try {
                    const taskData = await getTaskById(taskId);
                    setTask({
                        ...taskData,
                        comments: undefined,
                    });
                    setCommentList(taskData.comments || []);
                } catch (error) {
                    setError("데이터를 불러오는데 실패했습니다.");
                }
            };
            fetchData();
        }
    }, [taskId]);

    const navigate = useNavigate();

    const handleEdit = () => {
        if (task) {
            navigate('/tasks/edit', { state: { task } });
        }
    };

    const handleChangeStatusToComplete = async (taskId: string) => {
        try{
          await updateTaskStatus(taskId);
          window.location.reload(); // 페이지를 새로고침하여 변경 사항 반영
        } catch (error) {
          toast.error("Failed to update task status");
      }
    }

    
    // const handleDelete= async (taskId: string) => {
        
        // try {
        //     await deleteTask(taskId);
        //     navigate(-1);
        // } catch (error) {
        //     toast.error("Failed to delete task:");
        // }
    // };



    const [isModalVisible, setIsModalVisible] = useState(false);

  const handleDelete = async (taskId: string, deleteAll: boolean) => {
    try {
      if (deleteAll) {
        // 앞 10자리 기준으로 모든 관련 반복 업무 삭제
        
        try {
            const taskIdPrefix = taskId.slice(0, 10);
            await deleteRelatedTasks(taskIdPrefix);
            toast.success("업무가 정상적으로 삭제되었습니다!");
            navigate(-1);
        } catch (error) {
            toast.error("업무를 정상적으로 삭제하지 못했습니다.");
        }
      } else {
        // 개별 업무 삭제
        try {
            await deleteTask(taskId);
            toast.success("업무가 정상적으로 삭제되었습니다!");
            navigate(-1);
        } catch (error) {
            toast.error("업무를 정상적으로 삭제하지 못했습니다.");
        }
      }
      navigate(-1); // 이전 페이지로 이동
    } catch (error) {
      toast.error("업무 삭제에 실패했습니다.");
    }
  };

  const confirmDelete = (taskId: string) => {
    if (taskId.length > 10) {
      // 반복 업무인 경우 추가 모달 표시
      setIsModalVisible(true);
    } else {
      // 단일 업무 삭제
      handleDelete(taskId, false);
    }
  };

    // 로딩 상태 처리
    if (!task) {
        return <div>Loading...</div>;
    }

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

    const handleAddComment = async () => {
        const userInfo = sessionStorage.getItem("userInfo")
      ? JSON.parse(sessionStorage.getItem("userInfo") as string)
      : null;

      console.log(commentContent)
      if (taskId && commentContent.trim() && userInfo?.userId) {
        try {
          const newCommentData = await addComment({
            taskId,
            commentContent,
            commenterId: userInfo.userId, // 키 이름 수정
          });
          console.log("Comment added:", newCommentData);
          window.location.reload(); // 페이지를 새로고침하여 변경 사항 반영
        } catch (error) {
          console.error("Failed to create comment:", error);
        }
      }
    };

    const handleLike = async (commentId: bigint) => {
      
        if (userInfo?.userId) {
        try {
            const updatedComment = await addLiketoComment(commentId, userInfo?.userId);
            setCommentList(commentList.map(comment =>
              comment.commentId === commentId
                ? {
                    ...comment,
                    likeCount: comment.likedUsers.includes(userInfo?.userId)
                      ? comment.likeCount - 1
                      : comment.likeCount + 1,
                    likedUsers: comment.likedUsers.includes(userInfo?.userId)
                      ? comment.likedUsers.filter(id => id !== userInfo?.userId) // Remove userId if already liked
                      : [...comment.likedUsers, userInfo?.userId], // Add userId if not already liked
                  }
                : comment
            ));
            console.log(updatedComment);
        } catch (error) {
            console.error("Failed to add like:", error);
            //alert("좋아요를 추가할 수 없습니다. 다시 시도해 주세요.");
            toast.error('이미 좋아요한 댓글입니다. 😊')
        }
      }
    };

    const handleDeleteComment = async (commentId: bigint, userId: string) => {

        try {
            await deleteComment(commentId,userId); // taskId를 전달하여 삭제
            toast.warn('댓글이 삭제되었습니다!')
            window.location.reload(); // 페이지를 새로고침하여 변경 사항 반영
        } catch (error) {
            console.error("Failed to delete comment:", error);
            // 에러 발생 시 사용자에게 알림을 줄 수도 있습니다.
        }
      };

  return (
     <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
    
      {/* 카드 상단 */}
      <Card bordered={false} style={{ marginBottom: '20px' }}>
        {/* 프로세스 태그 */}
        <Space align="center"
        style={{
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
        }}>
        {/* ITO 프로세스 태그 */}
        <Space align="center" style={{ display: 'flex', alignItems: 'center' }}>
            {/* 제목 */}
            <Title level={2} style={{ fontWeight:'bold', margin:0}}>
                {task.taskName}
            </Title>
            {task.recurring && (
                <Tooltip title="반복업무" placement="right">
                <SyncOutlined
                style={{
                fontSize: '20px',
                color: '#c9c9c9',
                marginLeft: '8px',
                verticalAlign: 'middle', // 아이콘 수직 중앙 정렬
                }}/>
                </Tooltip>
            )}
        </Space>

  {/* 상태 */}
  
</Space>


        {/* 상세정보 */}
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Space align="center">
            <CalendarOutlined style={{ fontSize: '18px', color: '#F37920' }} />
            <Space>
            <Text style={{ fontSize: '16px', fontWeight:'bold'}}>기간</Text> 
              <Text> {task.startDate} ~ {task.dueDate}</Text>
            </Space>
          </Space>

          <Space align="center">
          <AccountTreeOutlinedIcon style={{ fontSize: '18px', color: '#52c41a' , verticalAlign: 'middle'}} />
            <Space>
            <Text style={{ fontSize: '16px', fontWeight:'bold'}}>ITO 프로세스</Text>
              <Tag
                color={processColors[processMap[task.itoProcessId]]}
                style={{
                    padding: '3px 6px',
                    borderRadius: '3px',
                    margin: '0 12px',
                }}
                >
                {processMap[task.itoProcessId]}
                </Tag>
            </Space>
          
          </Space>

          <Space align="center" style={{ display: 'flex', alignItems: 'center' }}>
  <UserOutlined style={{ fontSize: '18px', color: '#1890ff' }} />
  <Space>
  <Text style={{ fontSize: '16px', fontWeight: 'bold' }}>담당자</Text>
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
    {task.assignees.length <= 5 ? (
      // 담당자가 2명 이하일 경우, 모두 표시
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {task.assignees.map((assignee, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Avatar src={`http://localhost:8080/${assignee.assigneeProfile}`} />
            <Text>{assignee.assigneeName}</Text>
          </div>
        ))}
      </div>
    ) : (
      // 담당자가 3명 이상일 경우, Avatar.Group 사용
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Avatar.Group
          maxCount={2} // 최대 표시할 Avatar 수
          
        >
          {task.assignees.map((assignee, index) => (
            <Tooltip key={index} title={assignee.assigneeName} placement="top">
              <Avatar src={`http://localhost:8080/${assignee.assigneeProfile}`} />
            </Tooltip>
          ))}
        </Avatar.Group>
        <Text>
          {task.assignees[0].assigneeName} 외 {task.assignees.length - 1}명
        </Text>
      </div>
    )}
  </div>
  {task.assigneeConfirmation === 'N' ? (
    <Tooltip title="담당자 확인 전" color={'#c9c9c9'} placement="right">
      <RadioButtonUncheckedIcon style={{ color: '#c9c9c9', verticalAlign: 'middle' }} />
    </Tooltip>
  ) : (
    <Tooltip title="담당자 확인 완료" color={'#006AFF'} placement="right">
      <CheckCircleIcon style={{ color: '#006AFF', verticalAlign: 'middle' }} />
    </Tooltip>
  )}
</Space>

</Space>


          <Space>
          <FlagOutlined style={{ fontSize: '18px', color: '#00844A' }} />
            <Space>
            <Text style={{ fontSize: '16px', fontWeight:'bold'}}>상태</Text>
              <div>
     {StatusTag(task.status)}
  </div>
            </Space>
</Space>
          <Space align="center">
            <FileTextOutlined style={{ fontSize: '18px', color: '#722ed1' }} />
            <Space>
            <Text style={{ fontSize: '16px', fontWeight:'bold'}}>내용</Text>
              <Text> {task.description}</Text>
            </Space>
          </Space>
        </Space>

        {/* 버튼 */}
        <div style={{ marginTop: '20px', textAlign: 'right' }}>
        {
            task.status!==2&&task.assignees.some(assignee => assignee.assigneeId === userInfo.userId)?
            <Popconfirm
            title="완료 처리하시겠습니까?"
            onConfirm={()=>handleChangeStatusToComplete(task.taskId)}
        >
           <Button
                type="primary"
                icon={<CheckOutlined />}
                style={{ marginRight: '8px' }}
                >
                완료
                </Button>
        </Popconfirm>
                
              :<></>
        }
          
          {
            task.createdBy === userInfo.userId ?
                <>
                <Button
            type="default"
            icon={<EditOutlined />}
            onClick={handleEdit}
            style={{ marginRight: '8px' }}
          >
            수정
          </Button>
        
        
          <>
      {/* 삭제 버튼 */}
      <Popconfirm
        title="정말 삭제하시겠습니까?"
        onConfirm={()=>confirmDelete(task.taskId)} // 삭제 확인 시 confirmDelete 호출
      >
        <Button type="default" danger icon={<DeleteOutlined />}>
          삭제
        </Button>
      </Popconfirm>

      {/* 추가 모달: 반복 업무 삭제 여부 확인 */}
      <Modal
        title="반복 업무 삭제"
        visible={isModalVisible}
        onOk={() => {
          handleDelete(task.taskId, true); // 모든 반복 업무 삭제
          setIsModalVisible(false);
        }}
        onCancel={() => {
            handleDelete(task.taskId, false);
            setIsModalVisible(false)
        }}
        okText="모두 삭제"
        cancelText="이 업무만 삭제"
      >
        <p>이 업무는 반복 업무입니다. 관련된 모든 반복 업무를 삭제하시겠습니까?</p>
      </Modal>
    </>


                </>
              :<></>
        }
          

        </div>
      </Card>

      {/* 댓글 섹션 */}
      <Card bordered={false} title={<h3><MessageOutlined /> 댓글</h3>}>
        <List
            locale={{ emptyText: '등록된 댓글이 없습니다.' }} // 데이터가 없을 때 표시할 메시지
          dataSource={commentList}
          renderItem={(comment) => (
            <List.Item style={{ display: 'flex', alignItems: 'flex-start' }}>
                {/* 프로필 */}
                <Avatar src={`http://localhost:8080/${comment.commenter.commenterProfile}`} size={48} style={{ marginRight: '16px' }} />
                {/* 댓글 내용 */}
                <div style={{ flex: 1 }}>
                    {/* 작성자와 날짜 */}
                    <div>
                        <Text strong>{comment.commenter.commenterName}</Text>
                        <Text type="secondary" style={{ marginLeft: '8px' }}>
                        {dayjs(comment.createDate).format('YYYY/MM/DD HH:mm')}
                        </Text>
                    </div>

                    {/* 댓글 내용 */}
                    <div style={{ marginTop: '8px' }}>{comment.commentContent}</div>

                    {/* 좋아요 버튼 */}
                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
                        <Button
                            type="text"
                            icon={comment.likedUsers.includes(userInfo?.userId) ? <HeartFilled style={{ color: 'red' }} /> : <HeartOutlined />}
                            onClick={() => handleLike(comment.commentId)}
                        />
                        <Text style={{ marginLeft: '8px' }}>{comment.likeCount}</Text>
                    </div>
                </div>

                {/* 삭제 버튼 (작성자만 표시) */}
                {comment.commenter.commenterId === userInfo.userId && (
                    <div style={{ marginLeft: '16px' }}>
                    <Popconfirm
                        title="댓글을 삭제하시겠습니까?"
                        onConfirm={() => handleDeleteComment(comment.commentId, userInfo.userId)}
                    >
                        <Button type="text" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                    </div>
                )}
            </List.Item>
            )}
        />
        <Space direction="vertical" style={{ width: '100%', marginTop: '20px', textAlign: 'right' }}>
          <TextArea rows={3} placeholder="댓글을 작성하세요." value={commentContent} // 상태값과 연동
        onChange={(e) => setCommentContent(e.target.value)} // 상태값 업데이트
        />
          <Button type="primary" onClick={() => handleAddComment()}>
            댓글 작성
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default DetailTask;
