import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@components';
import { useAuth } from '@contexts/AuthContext'; // AuthContext 경로에 맞게 수정
import { LogoutButton } from '@components'; // 로그아웃 버튼 컴포넌트 import

const Main: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-start h-screen p-5 sm:p-2.5">
      <img src="/images/logo-original.png" alt="Logo" className="mt-5 mb-10 w-4/5 max-w-[300px]" />
      <div className="flex flex-col gap-3.5 w-4/5 max-w-[240px] mt-8">
        <Button label="매장 정보" onClick={() => router.push('/store-info')} />
        <Button label="과일 보기" onClick={() => router.push('/fruit-select')} />
        <Button label="장바구니" onClick={() => router.push('/cart')} />
        <Button label="마이 페이지" onClick={() => router.push('/profile')} />
        {/*<LogoutButton /> {/* 로그아웃 버튼 추가 */}
      </div>
    </div>
  );
};

export default Main;