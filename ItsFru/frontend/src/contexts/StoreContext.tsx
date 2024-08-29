import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from './AuthContext';

// 타입 정의
interface StoreInfo {
  store_id: number;
  store_name: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
}

interface StoreProduct {
  store_product_id: number;
  product_id: number;
  available_stock: number;
  price: number;
  store_id: number;
  updated_at: string;
}

interface Notice {
  notice_id: number;
  store_id: number;
  title: string;
  content: string | null;
  created_at: string;
  updated_at: string;
}

export interface FruitAnalysis {
  fruit_type: string;
  quality: string;
  freshness: string;
  price: number;
  discount_rate: number;
}

type StoreStatus = 'not_visited' | 'visiting' | 'error';

interface StoreContextType {
  currentStore: StoreInfo | null;
  storeStatus: StoreStatus;
  setCurrentStore: (store: StoreInfo | null) => void;
  products: StoreProduct[];
  notices: Notice[];
  isLoading: boolean;
  fruitAnalysis: FruitAnalysis | null;
  fetchStoreInfo: (storeId: number, token: string) => Promise<StoreInfo>;
  fetchStoreProducts: (storeId: number, token: string) => Promise<void>;
  fetchStoreNotices: (storeId: number, token: string) => Promise<void>;
  analyzeFruit: (storeId: number, image: File, token: string) => Promise<FruitAnalysis>;
  setFruitAnalysis: (analysis: FruitAnalysis | null) => void;
  exitStore: () => void;
  clearStoreInfo: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentStore, setCurrentStore] = useState<StoreInfo | null>(null);
  const [storeStatus, setStoreStatus] = useState<StoreStatus>('not_visited');
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fruitAnalysis, setFruitAnalysis] = useState<FruitAnalysis | null>(null);

  const fetchStoreInfo = useCallback(async (storeId: number, token: string): Promise<StoreInfo> => {
    setIsLoading(true);
    try {
      const response = await api.get<StoreInfo>(`/store/${storeId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCurrentStore(response.data);
      setStoreStatus('visiting');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch store info:', error);
      setStoreStatus('error');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchStoreProducts = useCallback(async (storeId: number, token: string) => {
    setIsLoading(true);
    try {
      const response = await api.get<StoreProduct[]>(`/stores/${storeId}/products`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch store products:', error);
      toast.error('상품 목록을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchStoreNotices = useCallback(async (storeId: number, token: string) => {
    setIsLoading(true);
    try {
      const response = await api.get<Notice[]>(`/stores/${storeId}/notices`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotices(response.data);
    } catch (error) {
      console.error('Failed to fetch store notices:', error);
      toast.error('공지사항을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const analyzeFruit = useCallback(async (storeId: number, image: File, token: string): Promise<FruitAnalysis> => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', image);
      formData.append('store_id', storeId.toString());

      const response = await api.post<FruitAnalysis>('/recognition-fruit', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      setFruitAnalysis(response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to analyze fruit:', error);
      toast.error('과일 분석에 실패했습니다.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const exitStore = useCallback(() => {
    setCurrentStore(null);
    setProducts([]);
    setNotices([]);
    setFruitAnalysis(null);
    setStoreStatus('not_visited');
    localStorage.removeItem('currentStore');
  }, []);

  const clearStoreInfo = useCallback(() => {
    setCurrentStore(null);
    setProducts([]);
    setNotices([]);
    setFruitAnalysis(null);
    setStoreStatus('not_visited');
    localStorage.removeItem('currentStore');
  }, []);

  useEffect(() => {
    const savedStore = localStorage.getItem('currentStore');
    if (savedStore) {
      const parsedStore = JSON.parse(savedStore);
      setCurrentStore(parsedStore);
      setStoreStatus('visiting');
    }
  }, []);

  useEffect(() => {
    if (currentStore) {
      localStorage.setItem('currentStore', JSON.stringify(currentStore));
    } else {
      localStorage.removeItem('currentStore');
    }
  }, [currentStore]);

  const contextValue: StoreContextType = {
    currentStore,
    storeStatus,
    setCurrentStore,
    products,
    notices,
    isLoading,
    fruitAnalysis,
    fetchStoreInfo,
    fetchStoreProducts,
    fetchStoreNotices,
    analyzeFruit,
    setFruitAnalysis,
    exitStore,
    clearStoreInfo,
  };

  return <StoreContext.Provider value={contextValue}>{children}</StoreContext.Provider>;
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};