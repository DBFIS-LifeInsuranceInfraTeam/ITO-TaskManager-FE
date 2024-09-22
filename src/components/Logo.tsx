import React from 'react';
import styles from '../styles/Logo.module.css';
import logo from '../styles/image/logo192.png';

const Logo: React.FC = () => {

    return (
            <div className={styles.logo}>
                <img src={logo} alt="logo"></img>
                <div>
                    <p>ITO</p>
                    <p>TaskManager</p>
                </div>
            </div>
    );
}

export default Logo;