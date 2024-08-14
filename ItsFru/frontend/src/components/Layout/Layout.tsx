// src/components/Layout.tsx
import React from 'react';
import { Header } from 'components'; // Header 컴포넌트 임포트
import styles from './layout.module.css'; // 스타일을 위한 CSS 모듈

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div>
      <Header /> {/* Header 컴포넌트 사용 */}
      <main className={styles.main}>{children}</main>
    </div>
  );
};

export default Layout;