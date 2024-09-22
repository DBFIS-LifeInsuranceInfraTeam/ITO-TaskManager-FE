import React from 'react'
import styles from '../styles/Dashboard.module.css';
import Stat from "../components/Stat";
import Header from "../components/Header";


const Dashboard: React.FC = () => {
    
  return (
        <div className={styles.content}>
            <Stat/>
            <div className={styles.container}>
                <Header/>
                <ul className={styles.dashboard}>
                    <li className={styles.detailsearch}>
                        <p>업무 조회</p>
                        <ul>
                            <li><input></input></li>
                            <li><input></input></li>
                            <li><input></input></li>
                            <button>조회</button>
                        </ul>
                    </li>
                    <li className={styles.list}>
                        <p>이번 달 할 일</p>
                        <ul>
                            <li><input></input></li>
                            <li><input></input></li>
                            <li><input></input></li>
                            <button>조회</button>
                        </ul>
                    </li>
                    <li className={styles.graph}>
                        <p>진행률</p>
                        <ul>
                            <li><input></input></li>
                            <li><input></input></li>
                            <li><input></input></li>
                            <button>조회</button>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default Dashboard;