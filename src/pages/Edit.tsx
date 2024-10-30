import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from '../styles/Add.module.css';
import { updateTask } from '../api/updateTask'; // PUT 요청을 보내는 함수
import { getUserByProjectId } from '../api/getUserByProjectId';

interface Task {
    taskId: number;
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
    itoProcessId: string;
    assigneeConfirmation: string;
  }

const Edit: React.FC = () => {
    
    const navigate = useNavigate();
    const location = useLocation();
    const { task } = location.state as { task: Task }; // task 데이터 추출
    
    const [taskName, setTaskName] = useState<string>('');
    const [startDate, setStartDate] = useState<string>('');
    const [dueDate, setDueDate] = useState<string>('');
    const [processId, setProcessId] = useState<string>('');
    const [assigneeId, setAssigneeId] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    
    const [formData, setFormData] = useState<Partial<Task>>(task); // 초기값을 task로 설정

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prevFormData => ({
        ...prevFormData,
        [name]: value,
        }));
    };

    const handleSave = async () => {
        
    };

    const handleCancel = () => {
        navigate(-1); // 이전 페이지로 이동
      };
    

    interface User {
        userId: string;
        name: string;
        // 필요에 따라 추가 속성 정의 가능
      }
    
    // userList의 타입을 User[]로 설정
    const [userList, setUserList] = useState<User[]>([]);
    

    useEffect(() => {
      const userInfo = sessionStorage.getItem("userInfo")
        ? JSON.parse(sessionStorage.getItem("userInfo") as string)
        : null;
        
      if (userInfo && userInfo.projectId) {
        const { projectId } = userInfo;
        
        const fetchUsers = async () => {
          try {
            const userListData = await getUserByProjectId(projectId);
            
            setUserList(userListData || []);
          } catch (error) {
            console.error("Error fetching users:", error);
          }
        };
        fetchUsers();
        
      }
    }, []);
    
    return (
    <div className={styles.container}> {/* className을 사용하여 스타일 적용 */}
        <h1 className={styles.title}>업무 수정</h1> {/* 제목에 클래스 추가 */}
        <div className={styles.detail}>
            <label htmlFor="title">제목</label>
            <input 
                type="text" 
                id="taskName" 
                value={taskName} 
                onChange={(e) => setTaskName(e.target.value)} 
                placeholder={task.taskName} 
                required 
            />
        </div>
      
      <div className={styles.detail}>
        <label htmlFor="duration">기간</label>
        <input 
            type="date" 
            id="startDate" 
            value={startDate} 
            onChange={(e) => setStartDate(e.target.value)} 
            placeholder={task.startDate} 
            required 
        />
        <input 
            type="date" 
            id="dueDate" 
            value={dueDate} 
            onChange={(e) => setDueDate(e.target.value)} 
            placeholder={task.dueDate} 
            required 
        />
      </div>
      
      <div className={styles.detail}>
        <label htmlFor="process">ITO 프로세스</label>
        <input 
            type="text" 
            id="processId" 
            value={processId} 
            onChange={(e) => setProcessId(e.target.value)} 
            placeholder={task.itoProcessId}  
            required 
        />
      </div>
      
      <div className={styles.detail}>
        <label htmlFor="manager">담당자</label>
          <select 
            id="assignee" 
            value={assigneeId} 
            onChange={(e) => setAssigneeId(e.target.value)} 
            required
          >
          {userList && userList.length > 0 ? (
            <>
              <option value="">담당자를 선택하세요.</option>
              {userList.map((user) => (
                <option key={user.userId} value={user.userId}>
                  {user.name}
                </option>
              ))}
            </>
          ) : (
            <option disabled>사용자가 없습니다</option>
          )}

        </select>
 
      </div>
      
      <div className={styles.detail}>
        <label htmlFor="description">내용</label>
        <input 
            type="text" 
            id="description" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            placeholder={task.description}  
            required 
        />
      </div>

      {/* 수정 버튼 추가 */}
      <div className={styles.buttonContainer}>
        <button  className={styles.addButton}>수정</button>
        <button onClick={handleCancel} className={styles.cancelButton}>취소</button>
      </div>
    </div>
  );
}

export default Edit;