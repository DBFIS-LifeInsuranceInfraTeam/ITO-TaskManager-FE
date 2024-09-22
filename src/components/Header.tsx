import React from 'react'
import searchicon from '../styles/image/search.svg';
import styles from '../styles/Header.module.css';


const Header: React.FC = () => {
  return (
    <div className={styles.searchContainer}>
                        <div className={styles.search}>
                            <input placeholder="업무 검색" spellCheck="false" className={styles.searchInput} />
                            <img src={searchicon} alt='' className={styles.searchIcon} />
                        </div>
                </div>
  )
}

export default Header