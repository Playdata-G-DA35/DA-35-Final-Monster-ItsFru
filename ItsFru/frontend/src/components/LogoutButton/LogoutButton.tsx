import React from 'react';
import { useRouter } from 'next/router';

type LogoutButtonProps = {
  className?: string;
};

const LogoutButton: React.FC<LogoutButtonProps> = ({ className }) => {
  const router = useRouter();

  const handleLogout = () => {
    sessionStorage.removeItem('isLoggedIn');
    router.push('/login');
  };

  return (
    <button
      type="button"
      className={`w-full py-4 px-2 border border-transparent rounded-md shadow-sm text-lg font-bold text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${className}`}
      onClick={handleLogout}
    >
      로그아웃
    </button>
  );
};

export default LogoutButton;