// src/components/StoreStatus.tsx
import React from 'react';
import { useStore } from '../contexts/StoreContext';

const StoreStatus = () => {
  const { storeName, setStoreName } = useStore();

  return (
    <div>
      <p>Current Store: {storeName}</p>
      <input
        type="text"
        value={storeName}
        onChange={(e) => setStoreName(e.target.value)}
        placeholder="Enter store name"
      />
    </div>
  );
};

export default StoreStatus;