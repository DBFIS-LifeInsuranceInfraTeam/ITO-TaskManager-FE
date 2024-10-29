import React, { useState } from 'react';
import styles from '../styles/Add.module.css';
import { addTask } from '../api/addTask';
import { useNavigate } from 'react-router-dom';

const Add: React.FC = () => {

    const [taskName, setTaskName] = useState<string>('');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [processId, setProcessId] = useState<string>('');
    const [asigneeId, setAsigneeId] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    
    const navigate = useNavigate();

    const handleAddTask = async () => {
        
        try {
            const taskData = {
                taskId:2,
                projectId:1,
                taskName:taskName,
                description:description,
                assigneeId: asigneeId,
                createdDate: new Date().toISOString().split('T')[0],
                startDate: new Date(startDate).toISOString().split('T')[0],
                dueDate: new Date(endDate).toISOString().split('T')[0],
                frequencyId:null,
                status:0,
                itoProcessId:1,
                assigneeConfirmation:'N',
            };

            const response = await addTask(taskData);
            console.log("add Task successful:", response);
            // Redirect or update state after successful signup here
            navigate('/');
            
        } catch (error) {
            alert("오류");
        }
    };

  return (
    <div className={styles.container}> {/* className을 사용하여 스타일 적용 */}
      <h1 className={styles.title}>업무 생성</h1> {/* 제목에 클래스 추가 */}
      
      <div className={styles.detail}>
        <label htmlFor="title">제목</label>
        <input 
            type="text" 
            id="taskName" 
            value={taskName} 
            onChange={(e) => setTaskName(e.target.value)} 
            placeholder="제목을 입력하세요." 
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
            placeholder="시작일을 입력하세요." 
            required 
        />
        <input 
            type="date" 
            id="endDate" 
            value={endDate} 
            onChange={(e) => setEndDate(e.target.value)} 
            placeholder="마감일을 입력하세요." 
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
            placeholder="프로세스를 입력하세요." 
            required 
        />
      </div>
      
      <div className={styles.detail}>
        <label htmlFor="manager">담당자</label>
        <input 
            type="text" 
            id="asignee" 
            value={asigneeId} 
            onChange={(e) => setAsigneeId(e.target.value)} 
            placeholder="담당자를 입력하세요." 
            required 
        />
      </div>
      
      <div className={styles.detail}>
        <label htmlFor="description">내용</label>
        <input 
            type="text" 
            id="description" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            placeholder="내용을 입력하세요." 
            required 
        />
      </div>

      {/* 수정 버튼 추가 */}
      <div className={styles.buttonContainer}>
        <button onClick={() => handleAddTask()} className={styles.addButton}>등록</button>
        <button className={styles.cancelButton}>취소</button>
      </div>
    </div>
  );
}

export default Add;
