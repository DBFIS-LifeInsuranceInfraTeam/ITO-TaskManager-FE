import React from 'react'
import styles from '../styles/Dashboard.module.css';
import Stat from "../components/Stat";
import List from '../components/List';
import btnAdd from '../styles/image/btnAdd.png';
import Calendar from "../components/Calendar";



const Dashboard: React.FC = () => {
    
    

  return (
        <div className={styles.content}>
            <Stat/>
            <div className={styles.container}>
                <ul className={styles.dashboard}>
                    <div className={styles.buttonDiv}>
                        <button className={styles.btnAdd}>
                            <img src={btnAdd} alt=""/>
                            업무 추가하기
                        </button>
                    </div>
                    <List/>
                    <Calendar/>
                    
                </ul>
            </div>
        </div>
    );
}

export default Dashboard;