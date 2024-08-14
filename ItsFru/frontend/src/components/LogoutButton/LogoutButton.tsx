// components/LogoutButton/index.tsx

import React from 'react';
import { useRouter } from 'next/router';
import  { Button } from 'components'; // Button 컴포넌트 경로에 따라 수정

const LogoutButton: React.FC = () => {
  const router = useRouter();

  const handleLogout = () => {
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('userRole');
    router.push('/login');
  };

  return <Button label="로그아웃" onClick={handleLogout} />;
};

export default LogoutButton;