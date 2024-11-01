import React, { useEffect, useState } from 'react';
import styles from '../styles/DetailPage.module.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { getTaskById } from '../api/getTaskById';
import { deleteTask } from '../api/deleteTask';
import { addComment } from '../api/addComment';
import { addLiketoComment } from '../api/addLiketoComment';


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


interface Comment {
  commentId: bigint;
  commenterId: string;
  commentContent: string;
  createDate: string;
  likeCount: number;
  likedByUser: boolean;
}

const Detail: React.FC = () => {
  
  const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const taskId = searchParams.get('taskId'); // id는 문자열로 받아지므로, 필요 시 숫자로 변환
    const [task, setTask] = useState<Task | undefined>();
    const [error, setError] = useState<string | null>(null);
    const [commentList, setCommentList] = useState<Comment[]>([]);
    const [commentContent, setCommentContent] = useState<string>('');

    useEffect(() => {
        if (taskId) {
            const fetchData = async () => {
                try {
                  const taskData = await getTaskById(taskId); // id를 숫자로 변환하여 전달
                  setTask({
                      ...taskData,
                      comments: undefined // comments 필드 제거
                  });
                  setCommentList(taskData.comments || []); // comments를 commentList에 설정
                } catch (error) {
                    setError("데이터를 불러오는데 실패했습니다.");
                }
            };
            fetchData();
        }
    }, [taskId]);

    const navigate = useNavigate();
    const handleEditClick = () => {
      navigate('/task/edit', { state: { task } }); // task 데이터 전달
    };

    const handleDeleteClick = async (taskId:string) => {
      const isConfirmed = window.confirm("정말 삭제하시겠습니까?"); // 삭제 여부 확인
      if (!isConfirmed) {
          return; // 사용자가 취소한 경우 함수 종료
      }
  
      try {
          await deleteTask(taskId); // taskId를 전달하여 삭제
          navigate(-1); // 삭제 성공 시 이전 페이지로 이동
      } catch (error) {
          console.error("Failed to delete task:", error);
          // 에러 발생 시 사용자에게 알림을 줄 수도 있습니다.
      }
    };


    const handleLikeClick = async (commentId: bigint) => {
      const userInfo = sessionStorage.getItem("userInfo")
      ? JSON.parse(sessionStorage.getItem("userInfo") as string)
      : null;
      if (userInfo?.userId) {
      try {
          const updatedComment = await addLiketoComment(commentId, userInfo?.userId);
          setCommentList((prevComments) =>
              prevComments.map((comment) =>
                  comment.commentId === commentId
                      ? {
                          ...comment,
                          likes: updatedComment.likeCount,
                          likedByUser: !comment.likedByUser,
                      }
                      : comment
              )
          );
      } catch (error) {
          console.error("Failed to add like:", error);
          alert("좋아요를 추가할 수 없습니다. 다시 시도해 주세요.");
      }
    }
  };

    const handleCommentSubmit = async () => {
        const userInfo = sessionStorage.getItem("userInfo")
      ? JSON.parse(sessionStorage.getItem("userInfo") as string)
      : null;

      if (taskId && commentContent.trim() && userInfo?.userId) {
        try {
          const newCommentData = await addComment({
            taskId,
            commentContent,
            commenterId: userInfo.userId, // 키 이름 수정
          });
          console.log("Comment added:", newCommentData);
        } catch (error) {
          console.error("Failed to create comment:", error);
        }
      }
    };

  return (
    <div className={styles.container}> {/* className을 사용하여 스타일 적용 */}
      <h1 className={styles.title}>업무 상세정보</h1> {/* 제목에 클래스 추가 */}
      
      <div className={styles.detail}>
        <label htmlFor="title">제목</label>
        <p id="title">{task?.taskName}</p>
      </div>
      
      <div className={styles.detail}>
        <label htmlFor="duration">기간</label>
        <p id="duration">{task?.startDate} ~ {task?.dueDate}</p>
      </div>
      
      <div className={styles.detail}>
        <label htmlFor="process">ITO 프로세스</label>
        <p id="process">{task?.itoProcessId}</p>
      </div>
      
      <div className={styles.detail}>
        <label htmlFor="manager">담당자</label>
        <p id="manager">{task?.assigneeId}</p>
      </div>
      
      <div className={styles.detail}>
        <label htmlFor="content">내용</label>
        <p id="content">{task?.description}</p>
      </div>

      {/* 수정 버튼 추가 */}
      <div className={styles.buttonContainer}>
        <button className={styles.editButton} onClick={handleEditClick}>수정</button>
        <button className={styles.cancelButton} onClick={() => task?.taskId && handleDeleteClick(task.taskId)}>삭제</button>
      </div>



      {/* 댓글 목록 */}
      <div className={styles.commentSection}>
        <h2>댓글 목록</h2>
        {commentList.length > 0 ? (
          commentList.map((comment) => (
            <div key={comment.commentId} className={styles.comment}>
            <p><strong>{comment.commenterId}:</strong> {comment.commentContent}</p>
            <p className={styles.timestamp}>{comment.createDate}</p>
            <button 
              className={styles.likeButton} 
              onClick={() => handleLikeClick(comment.commentId)}
            >
              {comment.likedByUser ? '♥️' : '♡'} {comment.likeCount}
            </button>
          </div>
          ))
        ) : (
          <p>댓글이 없습니다.</p>
        )}
      </div>

      {/* 댓글 작성 */}
      <div className={styles.commentInput}>
        <textarea
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
          placeholder="댓글을 작성하세요..."
        />
        <button onClick={handleCommentSubmit} className={styles.submitButton}>댓글 작성</button>
      </div>
    </div>
  );
}

export default Detail;
