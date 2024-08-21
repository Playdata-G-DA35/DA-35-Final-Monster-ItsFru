import React from 'react';
import { Card, Button } from '@components';
import { useRouter } from 'next/router';

const fakePurchaseDetails = [
  { fruit: '사과', variety: '부사', price: 2000, discountPrice: 1800 },
  { fruit: '포도', variety: '청포도', price: 3000, discountPrice: 1900 },
  // 추가적인 가짜 항목들
];

const PurchaseDetail: React.FC = () => {
  const router = useRouter();

  const totalOriginalPrice = fakePurchaseDetails.reduce((sum, item) => sum + item.price, 0);
  const totalDiscountPrice = fakePurchaseDetails.reduce((sum, item) => sum + item.discountPrice, 0);
  const mileageEarned = Math.floor(totalDiscountPrice * 0.05); // 적립 마일리지 예시
  const mileageUsed = 1000; // 사용 마일리지 예시
  const finalAmount = totalDiscountPrice - mileageUsed;

  const handleGoBack = () => {
    router.push('/profile?activeTab=1'); // activeTab=1을 쿼리 파라미터로 전달
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-center mb-6">결제 상세 정보</h1>
      <Card className="p-4">
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="border-b-2 p-2">과일</th>
              <th className="border-b-2 p-2">품종</th>
              <th className="border-b-2 p-2">판매가</th>
              <th className="border-b-2 p-2">할인가</th>
            </tr>
          </thead>
          <tbody>
            {fakePurchaseDetails.map((item, index) => (
              <tr key={index}>
                <td className="border-b p-2">{item.fruit}</td>
                <td className="border-b p-2">{item.variety}</td>
                <td className="border-b p-2">{item.price.toLocaleString()}원</td>
                <td className="border-b p-2">{item.discountPrice.toLocaleString()}원</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <div className="mt-6 space-y-2">
        <div className="flex justify-between">
          <span>총 가격:</span>
          <span>{totalOriginalPrice.toLocaleString()}원</span>
        </div>
        <div className="flex justify-between">
          <span>할인 금액:</span>
          <span>{(totalOriginalPrice - totalDiscountPrice).toLocaleString()}원</span>
        </div>
        <div className="flex justify-between">
          <span>적립 마일리지:</span>
          <span>{mileageEarned.toLocaleString()}점</span>
        </div>
        <div className="flex justify-between">
          <span>사용 마일리지:</span>
          <span>{mileageUsed.toLocaleString()}점</span>
        </div>
        <div className="flex justify-between font-bold">
          <span>결제 금액:</span>
          <span>{finalAmount.toLocaleString()}원</span>
        </div>
      </div>
      <div className="mt-8 text-center">
        <Button
          type="button"
          label="돌아가기"
          className="bg-blue-500 text-white hover:bg-blue-600"
          onClick={handleGoBack}
        />
      </div>
    </div>
  );
};

export default PurchaseDetail;