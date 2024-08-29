// src/components/Header.tsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useStore } from '@contexts/StoreContext';

const Header: React.FC = () => {
  const { currentStore } = useStore();

  return (
    <header className="flex items-center justify-between bg-[#e0f7e9] p-4 shadow-md">
      <div className="flex items-center">
        <Link href="/main" className="flex items-center">
          <Image
            src="/images/logo-original.png"
            alt="Logo"
            width={40}
            height={40}
            className="cursor-pointer"
          />
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        {currentStore && (
          <span className="text-green-700 font-semibold">
            {currentStore.store_name}
          </span>
        )}
      </div>
    </header>
  );
};

export default Header;