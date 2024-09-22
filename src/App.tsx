import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Menu from './components/Menu';
import styles from './styles/App.module.css';
import Dashboard from './pages/Dashboard';

const App: React.FC = () => {
  return (
    <Router>
      <div className={styles.container}>
        {/* 왼쪽 고정 메뉴바 */}
        <Menu />
        
        {/* 오른쪽 컨텐츠 영역 */}
        <div className={styles.content}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
