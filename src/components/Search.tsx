import React, { useState } from 'react'
import styles from '../styles/Search.module.css';
import filtericon from '../styles/image/dashboard/filter.svg';
import calendaricon from '../styles/image/dashboard/calendar.svg';
import searchicon from '../styles/image/dashboard/search.svg';

const Search:React.FC = () => {
    
    const [endDate, setEndDate] = useState<string>('');
    const [startDate, setStartDate] = useState<string>('');
  
  return (
    <>
        <li className={styles.detailsearch}>
                        <p>업무 조회</p>
                        <ul>
                            <li>
                                <div className={styles.search}>
                                    <select className={styles.searchSelect} >
                                        <option value="" disabled selected>프로세스 구분</option>
                                        <option value="avail">가용성</option>
                                        <option value="compos">구성</option>
                                        <option value="size">용량</option>
                                        <option value="change">변경</option>
                                        <option value="deploy">배포</option>
                                        <option value="report">리포팅</option>
                                        <option value="level">서비스수준</option>
                                    </select>
                                    <img src={filtericon} alt='' className={styles.searchIcon} />
                                </div>
                            </li>
                            <li>
                                <div className={styles.search}>
                                    <select className={styles.searchSelect} >
                                        <option value="" disabled selected>유닛</option>
                                        
                                    </select>
                                    <img src={filtericon} alt='' className={styles.searchIcon} />
                                </div>
                            </li>
                            <li>
                                <div className={styles.search}>
                                    <select className={styles.searchSelect} >
                                        <option value="" disabled selected>담당자</option>
                                        
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
                                        id="endDate" 
                                        value={endDate} 
                                        onChange={(e) => setEndDate(e.target.value)} 
                                        className={styles.searchInput}
                                        placeholder="마감일 선택" 
                                    />
                                    <img src={calendaricon} alt='' className={styles.searchIcon} />
                                </div></li>
                            <li><div className={styles.search}>
                                    <input placeholder="업무명" spellCheck="false" className={styles.searchInput} />
                                    <img src={searchicon} alt='' className={styles.searchIcon} />
                                </div></li>
                            <button>조회</button>
                        </ul>
                    </li>

    </>
  )
}

export default Search