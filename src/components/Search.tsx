import React, { useEffect, useState } from 'react'
import styles from '../styles/Search.module.css';
import filtericon from '../styles/image/dashboard/filter.svg';
import calendaricon from '../styles/image/dashboard/calendar.svg';
import searchicon from '../styles/image/dashboard/search.svg';

import { getUserByProjectId } from '../api/getUserByProjectId';


interface SearchProps {
    onSearch: (filters: {
        projectIds: string[];
        itoProcessId: string;
        unit: string;
        assigneeId: string;
        startDate: string;
        dueDate: string;
        taskName: string;
    }) => void;
}

const Search: React.FC<SearchProps> = ({ onSearch }) => {

    const [itoProcessId, setItoProcessId] = useState<string>('');
    const [assigneeId, setAssigneeId] = useState<string>('');
    const [unit, setUnit] = useState<string>('');
    const [startDate, setStartDate] = useState<string>('');
    const [dueDate, setDueDate] = useState<string>('');
    const [taskName, setTaskName] = useState<string>('');

    // userList의 타입을 User[]로 설정
    interface User {
        userId: string;
        name: string;
        // 필요에 따라 추가 속성 정의 가능
      }
    const [userList, setUserList] = useState<User[]>([]);
    

    const userInfo = sessionStorage.getItem("userInfo")
        ? JSON.parse(sessionStorage.getItem("userInfo") as string)
        : null;

    useEffect(() => {
      
        
      if (userInfo && userInfo.projectId) {
        
        const projectIds = userInfo.projectId;
        
        const fetchUsers = async () => {
          try {
            const userListData = await getUserByProjectId(projectIds);
            
            setUserList(userListData || []);
          } catch (error) {
            console.error("Error fetching users:", error);
          }
        };
        fetchUsers();
        
      }
    }, []);


    const handleSearchClick = () => {
        if (userInfo && userInfo.projectId) {
            const projectIds = userInfo.projectId;
            onSearch({
                projectIds,
                itoProcessId,
                assigneeId,
                unit,
                startDate,
                dueDate,
                taskName,
            });
        }
        
    };
  
  return (
    <>
        <li className={styles.detailsearch}>
                        <p>업무 조회</p>
                        <ul>
                            <li>
                                <div className={styles.search}>
                                    <select className={styles.searchSelect} 
                                        value={itoProcessId} 
                                        onChange={(e) => setItoProcessId(e.target.value)}>
                                        <option value=""  selected>프로세스 구분</option>
                                        <option value="1">가용성</option>
                                        <option value="2">구성</option>
                                        <option value="3">용량</option>
                                        <option value="4">변경</option>
                                        {/* <option value="deploy">배포</option>
                                        <option value="report">리포팅</option>
                                        <option value="level">서비스수준</option> */}
                                    </select>
                                    <img src={filtericon} alt='' className={styles.searchIcon} />
                                </div>
                            </li>
                            <li>
                                <div className={styles.search}>

                                   <select 
                                        id="unit" 
                                        className={styles.searchSelect}
                                        value={unit} 
                                        onChange={(e) => setUnit(e.target.value)} 
                                        required
                                    >
                                        <option value="">유닛</option>
                                        <option key="OS" value="OS">
                                            OS
                                            </option>
                                            <option key="MW" value="MW">
                                            미들웨어
                                            </option>
                                            <option key="DB" value="DB">
                                            DB
                                            </option>
                                            <option key="NET" value="NET">
                                            네트워크
                                            </option>
                                            <option key="SEC" value="SEC">
                                            보안
                                            </option>
                                    </select>
                                    <img src={filtericon} alt='' className={styles.searchIcon} />
                                </div>
                            </li>
                            <li>
                                <div className={styles.search}>
                                    <select className={styles.searchSelect} 
                                        value={assigneeId} 
                                        onChange={(e) => setAssigneeId(e.target.value)}
                                    >               
                                        {userList && userList.length > 0 ? (
                                            <>
                                            <option value=""  selected>담당자</option>
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
                                    <img src={filtericon} alt='' className={styles.searchIcon} />
                                </div>
                            </li>
                            <li><div className={styles.search}>
                                    <input 
                                        type="date" 
                                        id="startDate" 
                                        value={startDate} 
                                        onChange={(e) => setStartDate(e.target.value)} 
                                        className={styles.searchInput}
                                        placeholder="시작일 선택" 
                                    />
                                    <img src={calendaricon} alt='' className={styles.searchIcon} />
                                </div></li>
                            <li><div className={styles.search}>
                                    <input 
                                        type="date" 
                                        id="dueDate" 
                                        value={dueDate} 
                                        onChange={(e) => setDueDate(e.target.value)} 
                                        className={styles.searchInput}
                                        placeholder="마감일 선택" 
                                    />
                                    <img src={calendaricon} alt='' className={styles.searchIcon} />
                                </div></li>
                            <li><div className={styles.search}>
                                    <input placeholder="업무명" 
                                        value={taskName} 
                                        onChange={(e) => setTaskName(e.target.value)} 
                                        spellCheck="false" className={styles.searchInput} />
                                    <img src={searchicon} alt='' className={styles.searchIcon} />
                                </div></li>
                            <button onClick={handleSearchClick}>조회</button>
                        </ul>
                    </li>

    </>
  )
}

export default Search