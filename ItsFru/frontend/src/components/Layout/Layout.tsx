// src/components/Layout.tsx
import React from 'react';
import { Header, Footer } from 'components'; // Header와 Footer 컴포넌트 임포트

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header /> {/* Header 컴포넌트 사용 */}
      <main className="flex-grow p-4 bg-gray-100">{children}</main>
      <Footer /> {/* Footer 컴포넌트 사용 */}
    </div>
  );
};

export default Layout;