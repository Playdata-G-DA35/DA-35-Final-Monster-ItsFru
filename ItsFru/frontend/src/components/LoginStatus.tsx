// src/components/LoginStatus.tsx
import React from 'react';
import { useStore } from '../contexts/StoreContext';

const LoginStatus = () => {
  const { isLoggedIn, setIsLoggedIn } = useStore();

  return (
    <div>
      <p>Login Status: {isLoggedIn ? 'Logged In' : 'Logged Out'}</p>
      <button onClick={() => setIsLoggedIn(!isLoggedIn)}>
        {isLoggedIn ? 'Logout' : 'Login'}
      </button>
    </div>
  );
};

export default LoginStatus;