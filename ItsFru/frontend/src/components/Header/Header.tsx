// src/components/Header.tsx
import React from 'react';
import Link from 'next/link';
import styles from './header.module.css'; // 스타일을 위한 CSS 모듈

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <Link href="/main" className={styles.link}>메인화면</Link>
      </div>
      <div className={styles.right}>
        <Link href="/" className={styles.link}>마이페이지</Link>
        <Link href="/" className={styles.link}>로그아웃</Link>
      </div>
    </header>
  );
};

export default Header;