import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from '../styles/Add.module.css';
import { updateTask } from '../api/updateTask'; // PUT 요청을 보내는 함수
import { getUserByProjectId } from '../api/getUserByProjectId';

interface Task {
    taskId: string;
    projectId: string;
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
    itoProcessId: string;
    assigneeConfirmation: string;
  }

  interface updateTaskData {
    projectId: string;
    taskName: string;
    description: string;
    assigneeId: string;
    createdDate: string;
    startDate: string;
    dueDate: string;
    frequencyId: number|null;
    status: number;
    itoProcessId: string;
    assigneeConfirmation: string; //Y/N
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

    const handleEdit = async () => {
      const taskData: Partial<updateTaskData> = {};

      // 변경된 값만 taskData에 추가
      if (taskName && taskName !== task.taskName) {
        taskData.taskName = taskName;
      }
      if (startDate && startDate !== task.startDate) {
          taskData.startDate = startDate;
      }
      if (dueDate && dueDate !== task.dueDate) {
          taskData.dueDate = dueDate;
      }
      if (processId && processId !== task.itoProcessId) {
          taskData.itoProcessId = processId;
      }
      if (assigneeId && assigneeId !== task.assigneeId) {
          taskData.assigneeId = assigneeId;
      }
      if (description && description !== task.description) {
          taskData.description = description;
      }

      
      // projectId와 status는 필수로 포함될 수 있는 필드이므로 넣어줍니다.
      // taskData.projectId = task.projectId;
      // taskData.status = task.status;
      // taskData.assigneeConfirmation = task.assigneeConfirmation;
      // taskData.createdDate = task.createdDate;
      // taskData.frequencyId = task.frequencyId;

      // projectId와 status 등 필수 필드 포함
    const fullTaskData: updateTaskData = {
      projectId: taskData.projectId || task.projectId,
      taskName: taskData.taskName || task.taskName,
      description: taskData.description || task.description,
      assigneeId: taskData.assigneeId || task.assigneeId,
      createdDate: taskData.createdDate || task.createdDate,
      startDate: taskData.startDate || task.startDate,
      dueDate: taskData.dueDate || task.dueDate,
      frequencyId: taskData.frequencyId || task.frequencyId,
      status: taskData.status || task.status,
      itoProcessId: taskData.itoProcessId || task.itoProcessId,
      assigneeConfirmation: taskData.assigneeConfirmation || task.assigneeConfirmation,
  };
      // taskData가 비어있지 않은 경우에만 API 요청
      if (Object.keys(taskData).length > 0) {
          try {
              const response = await updateTask(task.taskId,fullTaskData);
              console.log("업무 수정 완료:", response);
              navigate(-1); // 성공 시 이전 페이지로 이동
          } catch (error) {
              console.error("업무 수정 중 오류:", error);
          }
      } else {
          console.log("변경된 사항이 없습니다.");
      }
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
            value={startDate || task.startDate} 
            onChange={(e) => setStartDate(e.target.value)} 
            className={startDate === task.startDate ? 'input-light' : ''}
            required 
        />
        <input 
            type="date" 
            id="dueDate" 
            value={dueDate || task.dueDate} 
            onChange={(e) => setDueDate(e.target.value)} 
            className={dueDate === task.dueDate ? 'input-light' : ''}
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
              <option value="">{task?.assigneeName}</option>
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
        <button onClick={handleEdit} className={styles.addButton}>수정</button>
        <button onClick={handleCancel} className={styles.cancelButton}>취소</button>
      </div>
    </div>
  );
}

export default Edit;