import React, { useEffect, useState } from 'react';
import styles from '../styles/Add.module.css';
import { addTask } from '../api/addTask';
import { useNavigate } from 'react-router-dom';
import { getUserByProjectId } from '../api/getUserByProjectId';
import { getProjectsByProjectId } from "../api/getProjectsByProjectId";

interface Project {
  
  projectId: string;
  name: string;
  description: string;
  smtpUrl?: string;
  smtpId?: string;
  smtpPw?: string;

}
const Add: React.FC = () => {

    const [taskName, setTaskName] = useState<string>('');
    const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0]);
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
    const [projectList, setProjectList] = useState<Project[]>([]); // 여러 프로젝트 지원을 위한 배열
    


  useEffect(() => {
    const userInfo = sessionStorage.getItem("userInfo")
          ? JSON.parse(sessionStorage.getItem("userInfo") as string)
          : null;

      if (userInfo && userInfo.projectId) {
          //setProjectList(userInfo.projectId);
          
          
          const fetchProjectList = async () => {
            try {
                const resProjectList = await getProjectsByProjectId(userInfo.projectId);
                setProjectList(resProjectList);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        fetchProjectList();
      }

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
    

function getWeekOfMonth(date:Date) {
  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const dayOfWeek = startOfMonth.getDay();
    
    
    // date.getDate()는 해당 월의 날짜(1일부터 시작하는 숫자)를 반환합니다.
    // startOfMonth.getDay()는 첫날의 요일을 나타내며 일요일이 0부터 시작합니다.
    // 따라서, 날짜에서 주의 시작일 오프셋을 빼고 7로 나눈 후 1을 더해주면 정확한 주차가 계산됩니다.
    return Math.ceil((date.getDate() + dayOfWeek) / 7);
}

function getWeekOfMonthForSpecificDay(date:Date) {
  const dayOfWeek = date.getDay(); // 요일 (0: 일요일, 1: 월요일, ..., 6: 토요일)
  let count = 0;

  // 해당 월의 첫 날부터 날짜를 증가시키며 해당 요일에 도달할 때마다 count 증가
  for (let d = 1; d <= date.getDate(); d++) {
      const currentDay = new Date(date.getFullYear(), date.getMonth(), d);
      
      if (currentDay.getDay() === dayOfWeek) {
          count++;
      }

      if (currentDay.getDate() === date.getDate()) {
          break;
      }
  }

  return count;
}

function getDayOfWeek(date:Date) {
  const days = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
  return days[date.getDay()];
}


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

                // recurring: true,
                // frequencyType: 'weekly',
                // frequencyInterval: 3,
                // weeklyDay: ['WEDNESDAY','FRIDAY'],
                // hasEndDate: false

                // recurring: true,
                // frequencyType: 'monthly',
                // frequencyInterval: 1,
                // monthlyDayOfMonth: 20

                // recurring: true,
                // frequencyType: 'monthly',
                // frequencyInterval: 1,
                // monthlyWeekOfMonth: 2,  // 매월 특정 주차 (예: 첫째 주)
                // monthlyDayOfWeek: 'THURSDAY'   // 매월 특정 요일 (예: 'Wednesday' - 첫째 주 수요일)
                
                recurring: true,
                frequencyType: 'yearly',
                yearlyMonth: new Date(startDate).getMonth() + 1,         // 매년 특정 월 (예: 11 - 11월)
                //yearlyDayOfMonth: new Date(startDate).getDate(),   // 매년 특정 일자 (예: 6일)
                yearlyWeekOfMonth: getWeekOfMonthForSpecificDay(new Date(startDate)),   // 매년 특정 주차 (예: 첫째 주)
                yearlyDayOfWeek: getDayOfWeek(new Date(startDate))     // 매년 특정 요일 (예: 'Wednesday' - 첫째 주 수요일)
            };

            const response = await addTask(taskData);
            
            console.log("add Task successful:", response);
            // Redirect or update state after successful signup here
            //navigate('/');
            
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
      
      <div className={styles.detailDate}>
      <div className={styles.detail}>
        <label htmlFor="duration">시작일</label>
        <input 
            type="date" 
            id="startDate" 
            value={startDate} 
            onChange={(e) => setStartDate(e.target.value)} 
            required 
        />
        </div>
        <div className={styles.detail}>
        <label htmlFor="duration">종료일</label>
        <input 
            type="date" 
            id="endDate" 
            value={endDate} 
            onChange={(e) => setEndDate(e.target.value)} 
            required 
        />
      </div>
      </div>
      
      <div className={styles.detail}>
        <label htmlFor="process">ITO 프로세스</label>
        <select
                    id="processId"
                    value={processId}
                    onChange={(e) => setProcessId(e.target.value)}
                    required
                >
                    <option value="">프로세스를 선택하세요.</option>
                    <option key="1" value="1">리포팅</option>
                    <option key="2" value="2">보안</option>
                    <option key="3" value="3">용량</option>
                    <option key="4" value="4">변경</option>
                    <option key="5" value="5">가용성</option>
                    <option key="6" value="6">감사지원</option>
                    <option key="7" value="7">구성</option>
                    <option key="8" value="8">배포</option>
                </select>
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
                    {projectList.map((project) => (
                        <option key={project.projectId} value={project.projectId}>
                            {project.name}
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
            <option value="">담당자를 선택하세요.</option>
          {userList && userList.length > 0 ? (
            <>
              
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
        
        <textarea
        id="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="내용을 입력하세요."
        required
        rows={4}       // 원하는 줄 높이를 지정 (예: 4줄)
        cols={50}     // 원하는 넓이를 지정 (예: 50글자 정도 넓이)
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
