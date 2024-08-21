import React, { createContext, useContext, useState, ReactNode } from 'react';
import axios from 'axios';

interface Store {
  id: string; // 백엔드의 store_id와 매핑
  name: string; // 백엔드의 store_name과 매핑
  address: string; // 백엔드의 location과 매핑
}

interface Product {
  id: string; // 백엔드의 product_id와 매핑
  name: string; // 백엔드의 product_name과 매핑
  price: number; // 백엔드의 price와 매핑
}

interface StoreContextType {
  currentStore: Store | null;
  storeList: Store[];
  setCurrentStore: (store: Store) => void;
  fetchStoreList: () => Promise<void>;
  fetchStoreDetails: (storeId: string) => Promise<void>;
  fetchProductList: (storeId: string) => Promise<Product[]>;
  exitStore: () => void; // 매장 정보 초기화
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentStore, setCurrentStore] = useState<Store | null>(null);
  const [storeList, setStoreList] = useState<Store[]>([]);

  const fetchStoreList = async () => {
    try {
      const response = await axios.get('/api/stores');
      setStoreList(response.data.map((store: any) => ({
        id: store.store_id,
        name: store.store_name,
        address: store.location,
      })));
    } catch (error) {
      console.error('Failed to fetch store list:', error);
    }
  };

  const fetchStoreDetails = async (storeId: string) => {
    try {
      const response = await axios.get(`/api/stores/${storeId}`);
      const store = response.data;
      setCurrentStore({
        id: store.store_id,
        name: store.store_name,
        address: store.location,
      });
    } catch (error) {
      console.error('Failed to fetch store details:', error);
    }
  };

  const fetchProductList = async (storeId: string): Promise<Product[]> => {
    try {
      const response = await axios.get(`/api/stores/${storeId}/products`);
      return response.data.map((product: any) => ({
        id: product.product_id,
        name: product.product_name,
        price: product.price,
      }));
    } catch (error) {
      console.error('Failed to fetch product list:', error);
      return [];
    }
  };

  const exitStore = () => {
    setCurrentStore(null); // 매장 정보 초기화
  };

  return (
    <StoreContext.Provider 
      value={{ 
        currentStore, 
        storeList, 
        setCurrentStore, 
        fetchStoreList, 
        fetchStoreDetails, 
        fetchProductList,
        exitStore
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};