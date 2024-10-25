import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Logo.module.css';
import logo from '../styles/image/dblogo192.png';

const Logo: React.FC = () => {

    return (
        <Link to="/" className={styles.link}>
            <div className={styles.logo}>
                <img src={logo} alt="logo"></img>
                <div>
                    <p>ITO</p>
                    <p>TaskManager v2</p>
                </div>
            </div>
        </Link>
    );
}

export default Logo;
