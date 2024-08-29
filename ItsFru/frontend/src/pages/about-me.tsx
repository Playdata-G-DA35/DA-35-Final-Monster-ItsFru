// src/pages/about-me.tsx
import React from 'react';
import { useRouter } from 'next/router';

const AboutMe: React.FC = () => {
  const router = useRouter();

  const goToMain = () => {
    router.push('/main');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <h1 className="text-3xl font-bold text-green-700 mb-6">About It's Fru</h1>
      <p className="text-lg text-gray-700 text-center max-w-2xl mb-6">
        It's Fru는 무인 과일 매장을 위한 서비스입니다. 
        고객은 과일 사진을 찍어 무인으로 결제할 수 있으며, 
        손상이 있을 시 적절한 할인을 제공합니다. 
      </p>
      <button 
        onClick={goToMain} 
        className="px-5 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
      >
        메인으로
      </button>
    </div>
  );
};

export default AboutMe;