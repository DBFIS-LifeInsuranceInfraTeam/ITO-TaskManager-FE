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

interface AddTaskData {
  projectId: string;
  taskName: string;
  description: string;
  assigneeId: string;
  createdDate: string;
  startDate: string;
  dueDate: string;
  frequencyId: null | number;
  status: number;
  itoProcessId: number;
  assigneeConfirmation: string;
  recurring: boolean;
  frequencyType: string;
  frequencyInterval?: number | null;
  hasEndDate?:boolean;
  weeklyDays?: string[];
  monthlyDayOfMonth?: number | null;
  monthlyWeekOfMonth?: number | null;
  monthlyDayOfWeek?: string | null;
  yearlyMonth?: number | null;
  yearlyDayOfMonth?: number | null;
  yearlyWeekOfMonth?: number | null;
  yearlyDayOfWeek?: string | null;
}

const Add: React.FC = () => {

    const [taskName, setTaskName] = useState<string>('');
    const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [processId, setProcessId] = useState<string>('');
    const [project, setProject] = useState<string>('');
    const [assigneeId, setAssigneeId] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    
    const [isRecurring, setIsRecurring] = useState<boolean>(false);
  const [frequencyType, setFrequencyType] = useState<string>('');
  const [frequencyInterval, setFrequencyInterval] = useState<number>(1);
  const [weeklyDays, setWeeklyDays] = useState<string[]>([]);
  const [monthlyDayOfMonth, setMonthlyDayOfMonth] = useState<number | null>(null);
  const [monthlyWeekOfMonth, setMonthlyWeekOfMonth] = useState<number | null>(null);
  const [monthlyDayOfWeek, setMonthlyDayOfWeek] = useState<string>('');
  const [yearlyMonth, setYearlyMonth] = useState<number | null>(null);
  const [yearlyDayOfMonth, setYearlyDayOfMonth] = useState<number | null>(null);
  const [yearlyWeekOfMonth, setYearlyWeekOfMonth] = useState<number | null>(null);
  const [yearlyDayOfWeek, setYearlyDayOfWeek] = useState<string>('');
  const [hasEndDate, setHasEndDate] = useState<boolean>(false);

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

// 반복 주기 옵션을 렌더링하는 함수
const renderFrequencyOptions = () => {
  switch (frequencyType) {
    case 'daily':
      return (
        <div className={styles.dailyContainer}>
          <div className={styles.dailyDayInput}>
            <input 
            type="number"
            value={frequencyInterval}
            onChange={(e) => setFrequencyInterval(Number(e.target.value))}
            />
            <span>일 마다</span>
          </div>
          <div className={styles.dailyHasEndDate}>
            <label>종료일</label>
             
            <input
              type="radio"
              name="endDate"
              value="없음"
              checked={!hasEndDate}
              onChange={() => setHasEndDate(false)}
              style={{ marginLeft: '8px' }}
            />
            <span>없음</span>
            
            <input
              type="radio"
              name="endDate"
              value="있음"
              checked={hasEndDate}
              onChange={() => setHasEndDate(true)}
              style={{ marginLeft: '8px' }}
            />
            <span>있음</span>

            {/* 종료일이 있을 때만 날짜 선택 입력 필드 표시 */}
            {hasEndDate && (
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={{ marginLeft: '8px' }}
              />
            )}
          </div>
        </div>
      );
    case 'weekly':
      return (
        <div>
          <label>간격 (주):</label>
          <input
            type="number"
            value={frequencyInterval}
            onChange={(e) => setFrequencyInterval(Number(e.target.value))}
          />

          <label>요일:</label>
          <div className={styles.detailDay}>
            {[
      { label: "일", value: "SUNDAY" },
      { label: "월", value: "MONDAY" },
      { label: "화", value: "TUESDAY" },
      { label: "수", value: "WEDNESDAY" },
      { label: "목", value: "THURSDAY" },
      { label: "금", value: "FRIDAY" },
      { label: "토", value: "SATURDAY" },
    ].map((day) => (
      <div>
        <span key={day.value}>{day.label}</span>
      <input
        type="checkbox"
        value={day.value}
        checked={weeklyDays.includes(day.value)}
        onChange={(e) => {
          const selectedDays = e.target.checked
            ? [...weeklyDays, day.value]
            : weeklyDays.filter((d) => d !== day.value);
          setWeeklyDays(selectedDays);
        }}
      />
      </div>
      
            ))}
          </div>


          
        </div>
      );
    case 'monthly':
      return (
        <div className={styles.monthlyContainer}>
          <div className={styles.detailMonth}>
          
            <div>
              <label>간격 (월):</label>
              <input
                type="number"
                value={frequencyInterval}
                onChange={(e) => setFrequencyInterval(Number(e.target.value))}
              />
            </div>
            <div>
              <label>일자:</label>
              <input
                type="number"
                value={monthlyDayOfMonth || ''}
                onChange={(e) => setMonthlyDayOfMonth(Number(e.target.value))}
              />
            </div>
          <div>
          <label>몇 번째 주:</label>
          <input
            type="number"
            value={monthlyWeekOfMonth || ''}
            onChange={(e) => setMonthlyWeekOfMonth(Number(e.target.value))}
          />
          </div>
          </div>
          <div className={styles.detailDay}>
            {[
      { label: "일", value: "SUNDAY" },
      { label: "월", value: "MONDAY" },
      { label: "화", value: "TUESDAY" },
      { label: "수", value: "WEDNESDAY" },
      { label: "목", value: "THURSDAY" },
      { label: "금", value: "FRIDAY" },
      { label: "토", value: "SATURDAY" },
    ].map((day) => (
      <div>
        <span key={day.value}>{day.label}</span>
      <input
        type="checkbox"
        value={day.value}
        checked={weeklyDays.includes(day.value)}
        onChange={(e) => {
          const selectedDays = e.target.checked
            ? [...weeklyDays, day.value]
            : weeklyDays.filter((d) => d !== day.value);
          setWeeklyDays(selectedDays);
        }}
      />
      </div>
      
            ))}
          </div>
        </div>
      );
    case 'yearly':
      return (
        <div className={styles.detailDate}>
          <label>월:</label>
          <input
            type="number"
            value={yearlyMonth || ''}
            onChange={(e) => setYearlyMonth(Number(e.target.value))}
          />
          <label>일자:</label>
          <input
            type="number"
            value={yearlyDayOfMonth || ''}
            onChange={(e) => setYearlyDayOfMonth(Number(e.target.value))}
          />
          <label>몇 번째 주:</label>
          <input
            type="number"
            value={yearlyWeekOfMonth || ''}
            onChange={(e) => setYearlyWeekOfMonth(Number(e.target.value))}
          />
          <label>요일:</label>
          <select
            value={yearlyDayOfWeek}
            onChange={(e) => setYearlyDayOfWeek(e.target.value)}
          >
            <option value="">요일 선택</option>
            <option value="SUNDAY">일요일</option>
            <option value="MONDAY">월요일</option>
            <option value="TUESDAY">화요일</option>
            <option value="WEDNESDAY">수요일</option>
            <option value="THURSDAY">목요일</option>
            <option value="FRIDAY">금요일</option>
            <option value="SATURDAY">토요일</option>
          </select>
        </div>
      );
    default:
      return null;
  }
};

  const handleAddTask = async () => {
      const userInfo = sessionStorage.getItem("userInfo")
      ? JSON.parse(sessionStorage.getItem("userInfo") as string)
      : null;
        try {
            const taskData:AddTaskData = {
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
                recurring: isRecurring,
                frequencyType: frequencyType,
                hasEndDate:false,
                // yearlyMonth: yearlyMonth || undefined, // null일 경우 undefined로 설정
                // yearlyDayOfMonth: yearlyDayOfMonth || undefined, // null일 경우 undefined로 설정
                // yearlyWeekOfMonth: yearlyWeekOfMonth || undefined,
                // yearlyDayOfWeek: yearlyDayOfWeek || undefined,
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
                
                // recurring: true,
                // frequencyType: 'yearly',
                // yearlyMonth: new Date(startDate).getMonth() + 1,         // 매년 특정 월 (예: 11 - 11월)
                // //yearlyDayOfMonth: new Date(startDate).getDate(),   // 매년 특정 일자 (예: 6일)
                // yearlyWeekOfMonth: getWeekOfMonthForSpecificDay(new Date(startDate)),   // 매년 특정 주차 (예: 첫째 주)
                // yearlyDayOfWeek: getDayOfWeek(new Date(startDate))     // 매년 특정 요일 (예: 'Wednesday' - 첫째 주 수요일)
            };

            // frequencyType에 따라 필요한 필드 추가
            switch (frequencyType) {
              case 'daily':
                taskData.frequencyInterval = frequencyInterval;
                break;
              
              case 'weekly':
                taskData.frequencyInterval = frequencyInterval;
                taskData.weeklyDays = weeklyDays; // 선택된 요일 배열
                break;
              
              case 'monthly':
                taskData.frequencyInterval = frequencyInterval;
                if (monthlyDayOfMonth) {
                  taskData.monthlyDayOfMonth = monthlyDayOfMonth;
                } else {
                  taskData.monthlyWeekOfMonth = monthlyWeekOfMonth;
                  taskData.monthlyDayOfWeek = monthlyDayOfWeek;
                }
                break;
              
              case 'yearly':
                taskData.yearlyMonth = yearlyMonth || undefined;
                if (yearlyDayOfMonth) {
                  taskData.yearlyDayOfMonth = yearlyDayOfMonth;
                } else {
                  taskData.yearlyWeekOfMonth = yearlyWeekOfMonth || undefined;
                  taskData.yearlyDayOfWeek = yearlyDayOfWeek || undefined;
                }
                break;
            }


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
      
      {/* <div className={styles.detailDate}>
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

      
      <div className={styles.detail}>
                    <label>반복 여부</label>
                    <div
                        className={`${styles.toggle} ${isRecurring ? styles.active : ''}`}
                        onClick={() => setIsRecurring(!isRecurring)}
                    >
                        <div className={styles.toggleCircle}></div>
                    </div>
                </div>
      </div> */}
      
      <div className={styles.detailDate}>
    <div className={styles.field}>
        <label htmlFor="startDate">시작일</label>
        <input 
            type="date" 
            id="startDate" 
            value={startDate} 
            onChange={(e) => setStartDate(e.target.value)} 
        />
    </div>

    <div className={styles.field}>
        <label htmlFor="endDate">종료일</label>
        <input 
            type="date" 
            id="endDate" 
            value={endDate} 
            onChange={(e) => setEndDate(e.target.value)} 
        />
    </div>

    <div className={styles.field}>
        <label>반복 여부</label>
        <div
            className={`${styles.toggle} ${isRecurring ? styles.active : ''}`}
            onClick={() => setIsRecurring(!isRecurring)}
        >
            <div className={styles.toggleCircle}></div>
        </div>
    </div>
</div>

      
      {isRecurring && (
    <>
      <div className={styles.detailFrequencyType}>
        <label>반복 주기</label>
        <div className={styles.buttonGroup}>
          <button
            type="button"
            className={frequencyType === 'daily' ? styles.activeButton : ''}
            onClick={() => setFrequencyType('daily')}
          >
            매일
          </button>
          <button
            type="button"
            className={frequencyType === 'weekly' ? styles.activeButton : ''}
            onClick={() => setFrequencyType('weekly')}
          >
            매주
          </button>
          <button
            type="button"
            className={frequencyType === 'monthly' ? styles.activeButton : ''}
            onClick={() => setFrequencyType('monthly')}
          >
            매월
          </button>
          <button
            type="button"
            className={frequencyType === 'yearly' ? styles.activeButton : ''}
            onClick={() => setFrequencyType('yearly')}
          >
            매년
          </button>
        </div>
      </div> 
      


      <div className={styles.detail}>
        {renderFrequencyOptions()}
      </div>
    </>
)}


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
