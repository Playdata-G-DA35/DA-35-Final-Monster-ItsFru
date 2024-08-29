import React from 'react';
import { Header, Footer } from 'components';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="flex-grow p-4 bg-gray-100 overflow-auto">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;