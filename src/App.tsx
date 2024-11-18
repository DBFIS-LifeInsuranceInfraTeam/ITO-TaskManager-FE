import React, { useState } from 'react';

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

import {
  AppstoreOutlined,
  BellOutlined,
  LogoutOutlined,
  MenuOutlined,
  SettingOutlined,
} from '@ant-design/icons';

import { Link, useLocation } from 'react-router-dom';
import Dashboard from "./pages/Dashboard";
import TaskList from "./pages/TaskList";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";

// import SideBar from "./components/SideBar";
import { Button, Layout, Menu, Tooltip } from 'antd';
import logo from './styles/images/logo.png';
import llogo from './styles/images/logo_v2.png';
import './styles/pages/SideBar.css';
import AddTask from "./pages/AddTask";
import DetailTask from "./pages/DetailTask";
import EditTask from './pages/EditTask';
import Login from "./pages/Login";
import RequireAuth from './components/RequireAuth';
import SignUp from "./pages/SignUp.tsx";

const { Sider, Content } = Layout;

// SideBar 컴포넌트 정의
type SideBarProps = {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
  onLogout: () => void;
};

const SideBar: React.FC<SideBarProps> = ({ collapsed, onCollapse, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <Sider
      width={220}
      collapsedWidth={80}
      collapsible
      collapsed={collapsed} // 부모에서 전달된 상태 사용
      onCollapse={(collapsed: boolean) => onCollapse(collapsed)} // 상태 업데이트 콜백
      trigger={null}
      breakpoint="xl"
      style={{
        height: '100vh',
      }}
    >
    {/* 로고 */}
    <div style={{ flex: 1 }}>
            <div
              style={{
                padding: 8,
                margin: 16,
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                flexDirection: 'column',
                cursor: 'pointer', // 커서 변경
              }}
              onClick={() => navigate('/')} // 로고 클릭 시 이동
            >
              <img
                src={collapsed ? logo : llogo}
                alt="logo"
                style={{
                  width: '100%',
  
                }}
              />
            </div>
            {/* 메뉴 */}
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        inlineCollapsed={collapsed} // collapsed 상태에 맞게 동작
        style={{
          backgroundColor: '#393939',
          
        }}
      >
        <Menu.Item
          key="/"
          icon={<AppstoreOutlined 
            style={{
              fontSize: '18px',
              color: '#fff',
              display: 'flex', // 아이콘 정렬을 위해 Flexbox 사용
              alignItems: 'center', // 세로 중앙 정렬
              justifyContent: 'center', // 가로 중앙 정렬
              
            }}/>}
        >
          <Link to="/" >대시보드</Link>
        </Menu.Item>
        <Menu.Item
          key="/tasks"
          icon={<MenuOutlined 
            style={{
              fontSize: '18px',
              color: '#fff',
              display: 'flex', // 아이콘 정렬을 위해 Flexbox 사용
              alignItems: 'center', // 세로 중앙 정렬
              justifyContent: 'center', // 가로 중앙 정렬
            }}/>}
        >
          <Link to="/tasks">업무리스트</Link>
        </Menu.Item>
        <Menu.Item
          key="/notifications"
          icon={<BellOutlined
            style={{
              fontSize: '18px',
              color: '#fff',
              display: 'flex', // 아이콘 정렬을 위해 Flexbox 사용
              alignItems: 'center', // 세로 중앙 정렬
              justifyContent: 'center', // 가로 중앙 정렬
            }}/>}
        >
          <Link to="/notifications">알림</Link>
        </Menu.Item>
        <Menu.Item
          key="/settings"
          icon={<SettingOutlined 
            style={{
              fontSize: '18px',
              color: '#fff',
              display: 'flex', // 아이콘 정렬을 위해 Flexbox 사용
              alignItems: 'center', // 세로 중앙 정렬
              justifyContent: 'center', // 가로 중앙 정렬
            }}
          
          />}
        >
          <Link to="/settings">설정</Link>
        </Menu.Item>
      </Menu>
  </div>

  {/* 로그아웃 버튼 */}
  <div
    style={{
      padding: 16,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >

<Tooltip title={collapsed ? '로그아웃' : ''} placement="right">
      <Button
        size="large"
        type="text"
        style={{
          backgroundColor: '#C0C0C020',
          color: '#fff',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}
        icon={<LogoutOutlined />}
        onClick={onLogout}
      >
        {!collapsed && '로그아웃'}
      </Button>
    </Tooltip>
  </div>
</Sider>
  );
};

// App 컴포넌트 정의
const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Router>
      <ToastContainer />
      <Routes>
        {/* 로그인 및 회원가입 */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* 메인 레이아웃 */}
        <Route
          path="*"
          element={
            <MainLayout collapsed={collapsed} setCollapsed={setCollapsed} />
          }
        />
      </Routes>
    </Router>
  );
};

// MainLayout 컴포넌트 정의
const MainLayout: React.FC<{ collapsed: boolean; setCollapsed: React.Dispatch<React.SetStateAction<boolean>> }> = ({
  collapsed,
  setCollapsed,
}) => {
  const navigate = useNavigate(); // 여기서 `useNavigate` 호출
  const handleLogout = () => {
    sessionStorage.removeItem('userInfo');
    toast.success('로그아웃되었습니다.');
    navigate('/login');
  };

  return (
    <RequireAuth>
      <Layout style={{ height: '100vh' }}>
      <SideBar collapsed={collapsed} onCollapse={setCollapsed} onLogout={handleLogout} />
      <Layout>
        <Content style={{ backgroundColor: '#fff', overflow: 'auto' }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tasks" element={<TaskList />} />
            <Route path="/tasks/add" element={<AddTask />} />
            <Route path="/tasks/detail" element={<DetailTask />} />
            <Route path="/tasks/edit" element={<EditTask />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
    </RequireAuth>
  );
};

export default App;
