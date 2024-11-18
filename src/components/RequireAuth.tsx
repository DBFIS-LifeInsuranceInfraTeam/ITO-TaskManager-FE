// import React from 'react';
// import { Navigate, useLocation } from 'react-router-dom';

// const RequireAuth: React.FC<{ children: JSX.Element }> = ({ children }) => {
//   const location = useLocation();

//   const userInfo = sessionStorage.getItem('userInfo');
//   if (!userInfo) {
//     // 로그인 페이지로 이동, 요청한 URL을 state로 저장
//     return <Navigate to="/login" replace state={{ from: location }} />;
//   }

//   return children;
// };

// export default RequireAuth;
import { Spin } from "antd";
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { LoadingOutlined } from '@ant-design/icons';


const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가
  const location = useLocation();
  
  useEffect(() => {
    const userInfo = JSON.parse(sessionStorage.getItem("userInfo") as string);
      
      console.log(userInfo)
      
      if (!userInfo) {
        // 로그인하지 않으면 로그인 페이지로 리다이렉트
        sessionStorage.setItem('redirectUrl', location.pathname + location.search);
        toast.error(
            <div>
              로그인이 필요합니다.
              <br />
              로그인 후 다시 시도해 주세요.
            </div>,
            
          );
        navigate('/login', { replace: true });
      }else{
        setIsLoading(false);
      }
  }, []);

  // 로그인 상태 체크 중일 때 로딩 화면 표시
  if (isLoading) {
    return <Spin indicator={<LoadingOutlined spin />} size="large" />; // 로딩 화면
  }

  return <>{children}</>;
};

export default RequireAuth;
