import React, { useEffect, useState } from 'react';
import styles from '../styles/Addv2.module.css';
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

interface User {
    userId: string;
    name: string;
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
    hasEndDate?: boolean;
    weeklyDays?: string[];
    monthlyDayOfMonth?: number | null;
    monthlyWeekOfMonth?: number | null;
    monthlyDayOfWeek?: string | null;
    yearlyMonth?: number | null;
    yearlyDayOfMonth?: number | null;
    yearlyWeekOfMonth?: number | null;
    yearlyDayOfWeek?: string | null;
}

const Addv2: React.FC = () => {
  const today = new Date();
  
  const [taskName, setTaskName] = useState<string>(''); // 업무 이름
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]); // 시작일
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0]); // 종료일
  const [processId, setProcessId] = useState<string>(''); // ITO 프로세스 ID
  const [project, setProject] = useState<string>(''); // 선택된 프로젝트 ID
  const [assigneeId, setAssigneeId] = useState<string>(''); // 담당자 ID
  const [description, setDescription] = useState<string>(''); // 업무 설명
  
  const [isRecurring, setIsRecurring] = useState<boolean>(false); // 반복 여부
  const [frequencyType, setFrequencyType] = useState<string>(''); // 반복 타입 (daily, weekly, monthly, yearly)
  const [frequencyInterval, setFrequencyInterval] = useState<number>(1); // 반복 간격
  
  const [weeklyDays, setWeeklyDays] = useState<string[]>([]); // 주 반복: 선택된 요일
  const [monthlyDayOfMonth, setMonthlyDayOfMonth] = useState<number | null>(null); // 월 반복: 특정 일
  const [monthlyWeekOfMonth, setMonthlyWeekOfMonth] = useState<number | null>(null); // 월 반복: 특정 주차
  const [monthlyDayOfWeek, setMonthlyDayOfWeek] = useState<string | null>(''); // 월 반복: 특정 요일
  
  const [yearlyMonth, setYearlyMonth] = useState<number | null>(null); // 연 반복: 특정 월
  const [yearlyDayOfMonth, setYearlyDayOfMonth] = useState<number | null>(null); // 연 반복: 특정 일
  const [yearlyWeekOfMonth, setYearlyWeekOfMonth] = useState<number | null>(null); // 연 반복: 특정 주차
  const [yearlyDayOfWeek, setYearlyDayOfWeek] = useState<string | null>(''); // 연 반복: 특정 요일
  
  const [hasEndDate, setHasEndDate] = useState<boolean>(false); // 종료 여부
  
  const [projectList, setProjectList] = useState<Project[]>([]); // 프로젝트 리스트
  const [userList, setUserList] = useState<User[]>([]); // 사용자 리스트
  

    const navigate = useNavigate();

    useEffect(() => {
       // 현재 날짜를 기준으로 주차 및 요일 계산
       const calculateMonthlyValues = () => {
        const dayOfWeek = today.getDay();
        const weekOfMonth = Math.ceil((today.getDate() + new Date(today.getFullYear(), today.getMonth(), 1).getDay()) / 7);
        setMonthlyDayOfMonth(today.getDate());
        setMonthlyWeekOfMonth(weekOfMonth);
        setMonthlyDayOfWeek(['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'][dayOfWeek]);
    };
    calculateMonthlyValues();
        const userInfo = sessionStorage.getItem("userInfo")
            ? JSON.parse(sessionStorage.getItem("userInfo") as string)
            : null;

        if (userInfo && userInfo.projectId) {
            const fetchProjectList = async () => {
                try {
                    const resProjectList = await getProjectsByProjectId(userInfo.projectId);
                    setProjectList(resProjectList);
                } catch (error) {
                    console.error("Error fetching projects:", error);
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

    const handleAddTask = async () => {
        try {
            const taskData: AddTaskData = {
                projectId: project,
                taskName: taskName,
                description: description,
                assigneeId: assigneeId,
                createdDate: new Date().toISOString().split('T')[0],
                startDate: new Date(startDate).toISOString().split('T')[0],
                dueDate: new Date(endDate).toISOString().split('T')[0],
                frequencyId: null,
                status: 0,
                itoProcessId: 1,
                assigneeConfirmation: 'N',
                recurring: isRecurring,
                frequencyType: frequencyType,
            };
            await addTask(taskData);
            navigate('/');
        } catch (error) {
            alert("오류 발생");
        }
    };

    return (
      <div className={styles.container}>
          <h1 className={styles.title}>업무 추가</h1>

          {/* 제목, 시작일, 종료일, 반복 여부 */}
          <div className={styles.row}>
              <div className={styles.field}>
                  <label>제목</label>
                  <input
                      type="text"
                      value={taskName}
                      onChange={(e) => setTaskName(e.target.value)}
                      placeholder="업무 제목"
                  />
              </div>
              <div className={styles.field}>
                  <label>시작일</label>
                  <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                  />
              </div>
              <div className={styles.field}>
                  <label>종료일</label>
                  <input
                      type="date"
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

          {/* 반복 여부에 따른 추가 입력 */}
          {isRecurring && (
    <>
        <div className={styles.field}>
            <label>반복 주기</label>
            <div className={styles.frequencyButtons}>
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

        {/* 반복 주기별 세부 입력 필드 */}
        {frequencyType === 'daily' && (
            <div className={styles.field}>
                <label>반복 간격 (일)</label>
                <input
                    type="number"
                    value={frequencyInterval}
                    onChange={(e) => setFrequencyInterval(Number(e.target.value))}
                />
                <div className={styles.field}>
                    <label>종료일 여부</label>
                    <div className={styles.toggle} onClick={() => setHasEndDate(!hasEndDate)}>
                        <div className={`${styles.toggleCircle} ${hasEndDate ? styles.active : ''}`}></div>
                    </div>
                    {hasEndDate && (
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    )}
                </div>
            </div>
        )}

        {frequencyType === 'weekly' && (
            <div className={styles.field}>
                <label>반복 간격 (주)</label>
                <input
                    type="number"
                    value={frequencyInterval}
                    onChange={(e) => setFrequencyInterval(Number(e.target.value))}
                />
                <label>요일 선택</label>
                <div className={styles.weekdays}>
                    {['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'].map((day) => (
                        <label key={day}>
                            <input
                                type="checkbox"
                                value={day}
                                checked={weeklyDays.includes(day)}
                                onChange={(e) =>
                                    setWeeklyDays(
                                        e.target.checked
                                            ? [...weeklyDays, day]
                                            : weeklyDays.filter((d) => d !== day)
                                    )
                                }
                            />
                            {day}
                        </label>
                    ))}
                </div>
            </div>
        )}

        {frequencyType === 'monthly' && (
            <div className={styles.field}>
                <label>반복 간격 (월)</label>
                <input
                    type="number"
                    value={frequencyInterval}
                    onChange={(e) => setFrequencyInterval(Number(e.target.value))}
                />
                <label>일자</label>
                <input
                    type="number"
                    value={monthlyDayOfMonth || ''}
                    onChange={(e) => setMonthlyDayOfMonth(Number(e.target.value))}
                />
                <label>또는 몇 번째 주와 요일</label>
                <input
                    type="number"
                    value={monthlyWeekOfMonth || ''}
                    onChange={(e) => setMonthlyWeekOfMonth(Number(e.target.value))}
                />
                <select
                    value={monthlyDayOfWeek || ''}
                    onChange={(e) => setMonthlyDayOfWeek(e.target.value)}
                >
                    <option value="">요일 선택</option>
                    {['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'].map((day) => (
                        <option key={day} value={day}>
                            {day}
                        </option>
                    ))}
                </select>
            </div>
        )}

        {frequencyType === 'yearly' && (
            <div className={styles.field}>
                <label>반복 간격 (년)</label>
                <input
                    type="number"
                    value={frequencyInterval}
                    onChange={(e) => setFrequencyInterval(Number(e.target.value))}
                />
                <label>월</label>
                <input
                    type="number"
                    value={yearlyMonth || ''}
                    onChange={(e) => setYearlyMonth(Number(e.target.value))}
                />
                <label>일자</label>
                <input
                    type="number"
                    value={yearlyDayOfMonth || ''}
                    onChange={(e) => setYearlyDayOfMonth(Number(e.target.value))}
                />
                <label>또는 몇 번째 주와 요일</label>
                <input
                    type="number"
                    value={yearlyWeekOfMonth || ''}
                    onChange={(e) => setYearlyWeekOfMonth(Number(e.target.value))}
                />
                <select
                    value={yearlyDayOfWeek || ''}
                    onChange={(e) => setYearlyDayOfWeek(e.target.value)}
                >
                    <option value="">요일 선택</option>
                    {['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'].map((day) => (
                        <option key={day} value={day}>
                            {day}
                        </option>
                    ))}
                </select>
            </div>
        )}
    </>
)}


          {/* ITO 프로세스 */}
          <div className={styles.field}>
              <label>ITO 프로세스</label>
              <select
                  value={processId}
                  onChange={(e) => setProcessId(e.target.value)}
              >
                  <option value="">프로세스를 선택하세요.</option>
                  <option value="1">리포팅</option>
                  <option value="2">보안</option>
                  <option value="3">용량</option>
                  <option value="4">변경</option>
                  <option value="5">가용성</option>
                  <option value="6">감사지원</option>
                  <option value="7">구성</option>
                  <option value="8">배포</option>
              </select>
          </div>

          {/* 프로젝트 선택 */}
          <div className={styles.field}>
              <label>프로젝트</label>
              <select
                  value={project}
                  onChange={(e) => setProject(e.target.value)}
              >
                  <option value="">프로젝트를 선택하세요.</option>
                  {projectList.map((proj) => (
                      <option key={proj.projectId} value={proj.projectId}>
                          {proj.name}
                      </option>
                  ))}
              </select>
          </div>

          {/* 담당자 선택 */}
          <div className={styles.field}>
              <label>담당자</label>
              <select
                  value={assigneeId}
                  onChange={(e) => setAssigneeId(e.target.value)}
              >
                  <option value="">담당자를 선택하세요.</option>
                  {userList.map((user) => (
                      <option key={user.userId} value={user.userId}>
                          {user.name}
                      </option>
                  ))}
              </select>
          </div>

          {/* 업무 상세 내용 */}
          <div className={styles.field}>
              <label>업무 상세 내용</label>
              <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="업무 내용을 입력하세요."
                  rows={4}
              />
          </div>
      </div>
  );
};


export default Addv2;
