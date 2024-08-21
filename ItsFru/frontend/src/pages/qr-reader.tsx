import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useZxing } from 'react-zxing';
import { useStore } from '@contexts/StoreContext';

const QrReaderPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const { setCurrentStore, fetchStoreDetails } = useStore();
  const router = useRouter();

  const handleScan = async (result: string) => {
    try {
      // TODO: 실제 QR 코드 데이터를 이용하여 매장 ID를 추출합니다.
      // const storeId = extractStoreIdFromQrData(result);

      // 테스트 버전이므로 '독산점'이라는 매장으로 연결합니다.
      const storeId = 'doksan';

      await fetchStoreDetails(storeId);
      setCurrentStore({ id: storeId, name: '독산점', address: '서울시 금천구 독산동' });
      router.push('/store-info');
    } catch (err) {
      setError('매장을 찾을 수 없습니다. 다시 시도해 주세요.');
    }
  };

  const { ref } = useZxing({
    onDecodeResult(result) {
      handleScan(result.getText());
    },
    onError(err) {
      console.error(err);
      setError('카메라 접근에 문제가 발생했습니다. 다시 시도해 주세요.');
    },
  });

  // 테스트용 QR 코드 입력
  const handleTestScan = () => {
    handleScan('doksan');
  };

  return (
    <div className="text-center p-5">
      <h1 className="text-2xl font-bold mb-4">QR 코드 스캔</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="flex flex-col items-center justify-center h-[60vh] mb-4">
        <video ref={ref} className="w-full max-w-md rounded-lg mb-2" />
        <button 
          onClick={handleTestScan} 
          className="px-5 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          테스트 QR 코드 스캔
        </button>
      </div>
    </div>
  );
};

export default QrReaderPage;