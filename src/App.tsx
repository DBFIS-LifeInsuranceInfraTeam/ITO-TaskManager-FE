import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Menu from './components/Menu';
import styles from './styles/App.module.css';
import Dashboard from './pages/Dashboard';
import Detail from './pages/Detail';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ConstructionPage from './pages/ConstructionPage';
import Add from './pages/Add';
import TaskList from './pages/TaskList';
import Setting from './pages/Setting';
import Edit from './pages/Edit';

// const App: React.FC = () => {
  
//   return (
//     <Router>
//       <div className={styles.container}>
//         {/* 왼쪽 고정 메뉴바 */}
//         <Menu />
        
//         {/* 오른쪽 컨텐츠 영역 */}
//         <div className={styles.content}>
//           <Routes>
//             <Route path="/" element={<Home />} />
//             <Route path="/dashboard" element={<Dashboard />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/signup" element={<Signup />} />
//           </Routes>
//         </div>
//       </div>
//     </Router>
//   );
// };


const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<MainLayout><Home /></MainLayout>} /> */}
        <Route path="/" element={<MainLayout><Dashboard /></MainLayout>} />
        <Route path="/list" element={<MainLayout><TaskList/></MainLayout>} />
        <Route path="/alarm" element={<MainLayout><ConstructionPage/></MainLayout>} />
        <Route path="/setting" element={<MainLayout><Setting/></MainLayout>} />
        <Route path="/task/edit" element={<MainLayout><Edit /></MainLayout>} />
        <Route path="/task/add" element={<MainLayout><Add /></MainLayout>} />
        <Route path="/task/detail" element={<MainLayout><Detail /></MainLayout>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
};

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className={styles.container}>
      <Menu />
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
};


export default App;
