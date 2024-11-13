import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

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
        navigate('/login', { replace: true });
      }else{
        setIsLoading(false);
       
      }
  }, []);

  // 로그인 상태 체크 중일 때 로딩 화면 표시
  if (isLoading) {
    return <div>Loading...</div>; // 로딩 화면
  }

  return <>{children}</>;
};

export default RequireAuth;
