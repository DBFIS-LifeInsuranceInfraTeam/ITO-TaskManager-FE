import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/global.css';  // 전역 CSS 파일을 import
import App from './App';  // 루트 컴포넌트 App.tsx import

// React 18 버전 이후 createRoot를 사용하여 렌더링
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);