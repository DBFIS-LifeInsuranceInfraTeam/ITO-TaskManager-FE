import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('userInfo');
    if (!isLoggedIn) {
      navigate('/login', { replace: true });
    } else {
      setIsLoading(false); // 로그인 되어 있으면 컴포넌트 렌더링
    }
  }, [navigate]);

  if (isLoading) {
    return <div>Loading...</div>; // 로딩 화면을 표시
  }

  return <>{children}</>;
};

export default RequireAuth;
