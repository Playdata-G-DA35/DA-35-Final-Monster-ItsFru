// src/contexts/StoreContext.tsx
import React, { createContext, useState, ReactNode, useContext } from 'react';

interface StoreContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  storeName: string;
  setStoreName: (name: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [storeName, setStoreName] = useState('');

  return (
    <StoreContext.Provider value={{ isLoggedIn, setIsLoggedIn, storeName, setStoreName }}>
      {children}
    </StoreContext.Provider>
  );
};

// Custom hook for using the StoreContext
export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};