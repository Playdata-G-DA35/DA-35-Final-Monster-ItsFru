import React from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@contexts/AuthContext';

const Footer: React.FC = () => {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const navigateToAbout = () => {
    router.push('/about-me');
  };

  const navigateToMain = () => {
    router.push('/main');
  };

  return (
    <footer className="bg-green-100 text-green-700 p-4 text-center mt-auto">
      <div className="flex justify-center space-x-4">
        <span
          onClick={navigateToMain}
          className="cursor-pointer hover:text-green-500"
        >
          메인으로
        </span>
        <span
          onClick={navigateToAbout}
          className="cursor-pointer hover:text-green-500"
        >
          about It's Fru
        </span>
        <span
          onClick={handleLogout}
          className="cursor-pointer hover:text-green-500"
        >
          로그아웃
        </span>
      </div>
      <p className="text-sm mt-2">© 2024 It's Fru. All rights reserved.</p>
    </footer>
  );
};

export default Footer;