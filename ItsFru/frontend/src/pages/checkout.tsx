import React from 'react';
import { useRouter } from 'next/router';
import { Button, Card } from '@components';

const CheckoutPage: React.FC = () => {
  const router = useRouter();

  // 하드코딩된 결제 정보
  const purchasedItems = [
    {
      id: 1,
      name: '사과',
      price: 4100,
      discountRate: 14,
      quantity: 1
    },
    {
      id: 2,
      name: '바나나',
      price: 2500,
      discountRate: 10,
      quantity: 2
    }
  ];

  const totalPrice = purchasedItems.reduce((total, item) => {
    return total + (item.price * (1 - item.discountRate / 100) * item.quantity);
  }, 0);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-6">결제가 완료되었습니다. 감사합니다!</h1>
      
      <div className="w-full max-w-md mb-6">
        {purchasedItems.map(item => (
          <Card key={item.id} className="mb-4 p-4">
            <h2 className="text-lg font-semibold">{item.name}</h2>
            <p>가격: ₩{item.price.toLocaleString()} / 개</p>
            <p>할인율: {item.discountRate}%</p>
            <p>수량: {item.quantity}</p>
            <p className="font-bold">
              소계: ₩{((item.price * (1 - item.discountRate / 100) * item.quantity)).toLocaleString()}
            </p>
          </Card>
        ))}
      </div>

      <div className="text-xl font-bold mb-6">
        총 결제 금액: ₩{totalPrice.toLocaleString()}
      </div>

      <div className="flex flex-col space-y-4 w-full max-w-md">
        <Button
          onClick={() => router.push('/main')}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded"
        >
          메인으로
        </Button>
        <Button
          onClick={() => router.push('/fruit-select')}
          className="w-full bg-green-500 text-white px-4 py-2 rounded"
        >
          과일 더보기
        </Button>
        <Button
          onClick={() => router.push('/profile')}
          className="w-full bg-yellow-500 text-white px-4 py-2 rounded"
        >
          마이 페이지
        </Button>
      </div>
    </div>
  );
};

export default CheckoutPage;