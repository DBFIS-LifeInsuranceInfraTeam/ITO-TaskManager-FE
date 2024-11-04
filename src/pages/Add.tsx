import React, { useEffect, useState } from 'react';
import styles from '../styles/Add.module.css';
import { addTask } from '../api/addTask';
import { useNavigate } from 'react-router-dom';
import { getUserByProjectId } from '../api/getUserByProjectId';

const Add: React.FC = () => {

    const [taskName, setTaskName] = useState<string>('');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [processId, setProcessId] = useState<string>('');
    const [project, setProject] = useState<string>('');
    const [assigneeId, setAssigneeId] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    
    const navigate = useNavigate();

    interface User {
      userId: string;
      name: string;
      // 필요에 따라 추가 속성 정의 가능
    }
    
    // userList의 타입을 User[]로 설정
    const [userList, setUserList] = useState<User[]>([]);
    const [projectList, setProjectList] = useState<string[]>([]); // 여러 프로젝트 지원을 위한 배열
    

    useEffect(() => {
      const userInfo = sessionStorage.getItem("userInfo")
          ? JSON.parse(sessionStorage.getItem("userInfo") as string)
          : null;

      if (userInfo && userInfo.projectId) {
          setProjectList(userInfo.projectId);
      }
  }, []);
    
  useEffect(() => {
    if (project) {
        const fetchUsers = async () => {
            try {
                const userListData = await getUserByProjectId(project);
                setUserList(userListData || []);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        fetchUsers();
    }
}, [project]);
    
    const handleAddTask = async () => {
      const userInfo = sessionStorage.getItem("userInfo")
      ? JSON.parse(sessionStorage.getItem("userInfo") as string)
      : null;
        try {
            const taskData = {
                projectId:project,
                taskName:taskName,
                description:description,
                assigneeId: assigneeId,
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
        <label htmlFor="project">프로젝트</label>
        <select
                    id="project"
                    value={project}
                    onChange={(e) => setProject(e.target.value)}
                    required
                >
                    <option value="">프로젝트를 선택하세요.</option>
                    {projectList.map((proj) => (
                        <option key={proj} value={proj}>
                            {proj}
                        </option>
                    ))}
                </select>
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
        {/* <input 
            type="text" 
            id="asignee" 
            value={asigneeId} 
            onChange={(e) => setAsigneeId(e.target.value)} 
            placeholder="담당자를 입력하세요." 
            required 
        /> */}
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


      <div className={styles.buttonContainer}>
        <button onClick={() => handleAddTask()} className={styles.addButton}>등록</button>
        <button className={styles.cancelButton}>취소</button>
      </div>
    </div>
  );
}

export default Add;
