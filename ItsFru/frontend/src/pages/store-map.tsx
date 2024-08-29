import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useStore } from '@contexts/StoreContext';
import { useAuth } from '@contexts/AuthContext';
import { toast } from 'react-toastify';
import { Spinner } from '@components';

const StoreMap: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { fetchStoreInfo, fetchStoreNotices, fetchStoreProducts, setCurrentStore, clearStoreInfo } = useStore();
  const { getToken } = useAuth();

  const handleTestStoreSelect = useCallback(async () => {
    setIsLoading(true);
    clearStoreInfo();

    try {
      const storeId = 1; // 테스트용 매장 ID
      
      const token = getToken();
      if (!token) {
        throw new Error('인증이 필요합니다. 다시 로그인해 주세요.');
      }
  
      console.log('Fetching store info for ID:', storeId);
      const storeInfo = await fetchStoreInfo(storeId, token);
      console.log('Store info fetched:', storeInfo);
      
      setCurrentStore(storeInfo);
      
      console.log('Fetching notices and products');
      await Promise.all([
        fetchStoreNotices(storeId, token),
        fetchStoreProducts(storeId, token)
      ]);
      
      console.log('All data fetched successfully');
      toast.success('매장 정보를 성공적으로 불러왔습니다.');
      
      console.log('Redirecting to store-info page');
      router.push(`/store-info?storeId=${storeId}`);
    } catch (err) {
      console.error('Error in handleTestStoreSelect:', err);
      const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다. 다시 시도해 주세요.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [fetchStoreInfo, fetchStoreNotices, fetchStoreProducts, setCurrentStore, router, getToken, clearStoreInfo]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="flex flex-col items-center p-4 pt-8">
      <h1 className="text-2xl font-bold mb-6">인근 매장 지도</h1>
      <div className="w-full max-w-md mb-6">
        <div className="relative w-full h-64">
          <Image
            src="/images/map-example.png"
            alt="매장 지도 예시"
            layout="fill"
            objectFit="contain"
          />
        </div>
      </div>
      <button
        onClick={handleTestStoreSelect}
        className="px-5 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        disabled={isLoading}
      >
        매장 확인 (TEST: id 1)
      </button>
      <div className="flex-grow"></div>
    </div>
  );
};

export default StoreMap;