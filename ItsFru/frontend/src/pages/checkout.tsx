import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@components';

const CheckoutPage: React.FC = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-6">결제가 완료되었습니다. 감사합니다!</h1>
      <div className="flex flex-col space-y-4">
        <Button
          label="메인으로"
          onClick={() => router.push('/main')}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded"
        />
        <Button
          label="과일 더보기"
          onClick={() => router.push('/fruit-select')}
          className="w-full bg-green-500 text-white px-4 py-2 rounded"
        />
        <Button
          label="마이 페이지"
          onClick={() => router.push('/profile')}
          className="w-full bg-yellow-500 text-white px-4 py-2 rounded"
        />
      </div>
    </div>
  );
};

export default CheckoutPage;