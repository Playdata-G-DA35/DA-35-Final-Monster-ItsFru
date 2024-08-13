import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

const HomePage: React.FC = () => {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.logoContainer}>
          <Image
            src="/images/logo-home.png"
            alt="ItsFru Logo"
            width={300}
            height={200}
            priority
          />
        </div>
        <hr className={styles.divider} />
        <div className={styles.buttonContainer}>
          <Link href="/login" className={styles.button}>
            <span role="img" aria-label="login">👤</span> 로그인
          </Link>
          <Link href="/signup" className={styles.button}>
            <span role="img" aria-label="signup">✔️</span> 회원 가입
          </Link>
        </div>
      </main>
    </div>
  );
};

export default HomePage;