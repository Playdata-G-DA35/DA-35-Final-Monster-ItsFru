import React from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

const StoreSelect: React.FC = () => {
  const router = useRouter();

  const handleQRClick = () => {
    router.push('/qr-reader');
  };

  const handleMapClick = () => {
    router.push('/store-map');
  };

  const handleGoToMain = () => {
    router.push('/main');
  };

  return (
    <div className="container mx-auto px-4 py-6 flex flex-col items-center min-h-screen">
      <h2 className="text-center text-xl font-semibold mt-8">
        쇼핑을 희망하시나요?<br />
        매장을 알려주세요!
      </h2>
      <div className="flex flex-col space-y-4 w-full mt-12">
        <button
          onClick={handleQRClick}
          className="h-40 bg-white rounded-lg shadow-md flex flex-col justify-center items-center text-lg font-semibold text-gray-700 hover:bg-gray-100 mx-8"
        >
          QR코드로 알려주기
          <Image
            src="/images/qr-code.png"
            alt="QR Code"
            width={70}
            height={70}
            className="mt-2 shadow-sm"
          />
        </button>
        <button
          onClick={handleMapClick}
          className="h-40 bg-white rounded-lg shadow-md flex flex-col justify-center items-center text-lg font-semibold text-gray-700 hover:bg-gray-100 mx-8"
        >
          지도로 알려주기
          <Image
            src="/images/map-icon.png"
            alt="Map Icon"
            width={70}
            height={70}
            className="mt-2 shadow-sm"
          />
        </button>
      </div>
      <button
        onClick={handleGoToMain}
        className="mt-8 px-5 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
      >
        메인으로
      </button>
    </div>
  );
};

export default StoreSelect;