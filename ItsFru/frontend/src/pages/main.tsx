import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@components'; // 버튼 컴포넌트 import
import styles from '@styles/Main.module.css';

const Main: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
    if (!loggedIn) {
      router.push('/login');
    }
  }, [router]);

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className={styles.container}>
        <img src="/images/logo-original.png" alt="Logo" className={styles.logo} />
        <div className={styles.buttonContainer}>
            <Button label="매장 정보" onClick={() => router.push('/store-info')} />
            <Button label="과일 고르기" onClick={() => router.push('/fruit-select')} />
            <Button label="장바구니" onClick={() => router.push('/cart')} />
            <Button label="마이 페이지" onClick={() => router.push('/profile')} />
            <Button label="로그아웃" onClick={() => router.push('/login')} />
        </div>
    </div>
    );
};

export default Main;