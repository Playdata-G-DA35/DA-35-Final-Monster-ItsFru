import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useZxing } from 'react-zxing';
import { useStore } from '@contexts/StoreContext';
import { useAuth } from '@contexts/AuthContext';
import { toast } from 'react-toastify';
import { Spinner } from '@components';

const QrReaderPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(true);
  const { fetchStoreInfo, fetchStoreNotices, fetchStoreProducts, isLoading, storeStatus, setCurrentStore, clearStoreInfo, currentStore } = useStore();
  const { getToken } = useAuth();
  const router = useRouter();

  useEffect(() => {
    clearStoreInfo();
  }, [clearStoreInfo]);

  useEffect(() => {
    if (currentStore && !isLoading) {
      console.log('Current store set, ready for use:', currentStore);
    }
  }, [currentStore, isLoading]);

  const handleScan = useCallback(async (result: string) => {
    setIsScanning(false);
    setError(null);
    try {
      const storeId = parseInt(result, 10);
      
      if (isNaN(storeId) || storeId < 1) {
        throw new Error('유효하지 않은 매장 ID입니다.');
      }
  
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
      console.error('Error in handleScan:', err);
      const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다. 다시 시도해 주세요.';
      setError(errorMessage);
      toast.error(errorMessage);
      setIsScanning(true);
    }
  }, [fetchStoreInfo, fetchStoreNotices, fetchStoreProducts, setCurrentStore, router, getToken]);

  const { ref } = useZxing({
    onDecodeResult(result) {
      handleScan(result.getText());
    },
    onError(err) {
      console.error('Camera access error:', err);
      setError('카메라 접근에 문제가 발생했습니다. 다시 시도해 주세요.');
      toast.error('카메라 접근에 문제가 발생했습니다. 다시 시도해 주세요.');
    },
  });

  const handleTestScan = useCallback(() => {
    console.log('Test scan button clicked');
    handleScan('1');
  }, [handleScan]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="text-center p-5">
      <h1 className="text-2xl font-bold mb-4">QR 코드 스캔</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="flex flex-col items-center justify-center h-[60vh] mb-4">
        {isScanning && <video ref={ref} className="w-full max-w-md rounded-lg mb-2" />}
        <button 
          onClick={handleTestScan} 
          className="px-5 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          aria-label="테스트 QR 코드 스캔 (매장 ID: 1)"
        >
          테스트 QR 코드 스캔 (매장 ID: 1)
        </button>
      </div>
    </div>
  );
};

export default QrReaderPage;