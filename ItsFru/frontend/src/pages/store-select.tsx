import React, { useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useStore } from '@contexts/StoreContext';
import { useAuth } from '@contexts/AuthContext';
import { toast } from 'react-toastify';
import { Spinner } from '@components';

const StoreSelect: React.FC = () => {
  const router = useRouter();
  const { currentStore, clearStoreInfo, storeStatus, isLoading, fetchStoreInfo } = useStore();
  const { getToken } = useAuth();

  useEffect(() => {
    clearStoreInfo();
  }, [clearStoreInfo]);

  useEffect(() => {
    if (currentStore && storeStatus === 'visiting') {
      router.push('/store-info').catch((err) => {
        console.error('Failed to navigate:', err);
        toast.error('페이지 이동에 실패했습니다.');
      });
    }
  }, [currentStore, router, storeStatus]);

  const handleStoreSelection = useCallback(async (storeId: number) => {
    try {
      const token = getToken();
      if (!token) {
        toast.error('로그인이 필요합니다.');
        return;
      }

      await fetchStoreInfo(storeId, token);
      router.push('/store-info');
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('404')) {
          toast.error('매장을 찾을 수 없습니다.');
        } else {
          toast.error('매장 정보를 불러오는데 실패했습니다.');
        }
      }
      console.error('Failed to fetch store info:', error);
    }
  }, [fetchStoreInfo, router, getToken]);

  const handleNavigation = useCallback((path: string) => {
    router.push(path).catch((err) => {
      console.error(`Failed to navigate to ${path}:`, err);
      toast.error('페이지 이동에 실패했습니다.');
    });
  }, [router]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="container mx-auto px-4 py-6 flex flex-col items-center min-h-screen">
      <h1 className="text-center text-2xl font-semibold mt-8">
        쇼핑을 희망하시나요?<br />
        매장을 알려주세요!
      </h1>
      <div className="flex flex-col space-y-4 w-full mt-12">
        <SelectionButton
          onClick={() => handleNavigation('/qr-reader')}
          label="QR코드로 알려주기"
          imageSrc="/images/qr-code.png"
          imageAlt="QR Code"
        />
        <SelectionButton
          onClick={() => handleNavigation('/store-map')}
          label="지도로 알려주기"
          imageSrc="/images/map-icon.png"
          imageAlt="Map Icon"
        />
      </div>
      <button
        onClick={() => handleNavigation('/main')}
        className="mt-8 px-5 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        aria-label="메인 페이지로 이동"
      >
        메인으로
      </button>
    </div>
  );
};

interface SelectionButtonProps {
  onClick: () => void;
  label: string;
  imageSrc: string;
  imageAlt: string;
}

const SelectionButton: React.FC<SelectionButtonProps> = React.memo(({ onClick, label, imageSrc, imageAlt }) => (
  <button
    onClick={onClick}
    className="h-40 bg-white rounded-lg shadow-md flex flex-col justify-center items-center text-lg font-semibold text-gray-700 hover:bg-gray-100 mx-8 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50"
    aria-label={label}
  >
    {label}
    <Image
      src={imageSrc}
      alt={imageAlt}
      width={70}
      height={70}
      className="mt-2 shadow-sm"
    />
  </button>
));

SelectionButton.displayName = 'SelectionButton';

export default StoreSelect;