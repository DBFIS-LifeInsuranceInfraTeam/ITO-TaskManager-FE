import React from 'react'
import styles from '../styles/Dashboard.module.css';
import Stat from "../components/Stat";
import Header from "../components/Header";
import Search from '../components/Search';
import Graph from '../components/Graph';
import List from '../components/List';


const Dashboard: React.FC = () => {
    
    
  return (
        <div className={styles.content}>
            <Stat/>
            <div className={styles.container}>
                <Header/>
                <ul className={styles.dashboard}>
                    <Search/>
                    <List/>
                    <Graph/>  
                </ul>
            </div>
        </div>
    );
}

export default Dashboard;