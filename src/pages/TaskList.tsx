import React from 'react'
import styles from '../styles/TaskList.module.css';
import List from '../components/List';
import Search from '../components/Search';
const TaskList:React.FC = () => {
  return (
    <div className={styles.container}>
        <Search/>
        <List/>
    </div>
  )
}

export default TaskList