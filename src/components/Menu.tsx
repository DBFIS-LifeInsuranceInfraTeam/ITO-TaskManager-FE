import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from '../styles/Menu.module.css';
import dashboardicon from '../styles/image/menu/dashboard.svg';
import listicon from '../styles/image/menu/list.svg';
import alarmicon from '../styles/image/menu/alarm.svg';
import settingicon from '../styles/image/menu/setting.svg';
import logouticon from '../styles/image/menu/logout.svg';
import Logo from "./Logo";

const Menu: React.FC = () => {
    const location = useLocation(); // 현재 경로 가져오기
    
    // 현재 경로가 활성화된 메뉴 항목에 대해 스타일 적용
    const isActive = (path: string) => location.pathname === path;

    return (
        <div className={styles.menu}>
            <Logo/>
            <ul>
                <li className={isActive('/dashboard') ? styles.active : ''}>
                    <div className={isActive('/dashboard') ? styles.active : styles.inactive}/>
                    <Link to="/dashboard">
                        <img src={dashboardicon} alt=''></img>
                        대시보드
                    </Link>
                </li>
                <li className={isActive('/list') ? styles.active : ''}> 
                <div className={isActive('/list') ? styles.active : styles.inactive}/>
                    <Link to="/list">
                        <img src={listicon} alt=''></img>
                        업무리스트
                    </Link>
                </li>
                <li className={isActive('/alarm') ? styles.active : ''}>
                <div className={isActive('/alarm') ? styles.active : styles.inactive}/>
                    <Link to="/alarm">
                        <img src={alarmicon} alt=''></img>
                        알림
                    </Link>
                </li>
                <li className={isActive('/setting') ? styles.active : ''}>
                <div className={isActive('/setting') ? styles.active : styles.inactive}/>
                    <Link to="/setting">
                        <img src={settingicon} alt=''></img>
                        설정
                    </Link>
                </li>
            </ul>
            
            <Link to="/login" className={styles.logout}>
                <img src={logouticon} alt=''></img>
                로그아웃
            </Link>
        </div>
    );
}

export default Menu;