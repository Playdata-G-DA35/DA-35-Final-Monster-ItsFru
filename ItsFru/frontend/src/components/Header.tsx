import React from 'react';
import Link from 'next/link';
import styles from './Header.module.css';

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <h1>ItsFru</h1>
      <nav>
        <Link href="/" className={styles.navLink}>
          홈
        </Link>
        <Link href="/about" className={styles.navLink}>
          소개
        </Link>
        <Link href="/contact" className={styles.navLink}>
          문의
        </Link>
      </nav>
    </header>
  );
};

export default Header;