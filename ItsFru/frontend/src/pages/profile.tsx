import React, { useState, useEffect } from 'react';
import { Tap, Card, Input, Button } from '@components';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '@contexts/AuthContext';
import { useRouter } from 'next/router';

interface Purchase {
  id: string;
  date: string;
  storeName: string;
  items: string;
  amount: number;
}

const fakePurchases: Purchase[] = [
  { id: '1', date: '2024-08-01', storeName: '독산점', items: '사과, 배 외 3항목', amount: 15000 },
  { id: '2', date: '2024-08-15', storeName: '가디점', items: '바나나 외 2항목', amount: 12000 },
  // 추가적인 가짜 항목들
];

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [phone, setPhone] = useState(user?.phone || '010-1234-5678');
  const [smsConsent, setSmsConsent] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (user) {
      setPhone(user.phone);
    }

    // 쿼리 파라미터에서 activeTab을 읽어와 설정
    const queryTab = router.query.activeTab;
    if (queryTab) {
      setActiveTab(parseInt(queryTab as string, 10));
    }
  }, [user, router.query.activeTab]);

  const handlePasswordCheck = async () => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/verify-password`, {
        email: user?.email,
        password,
      });

      if (response.data.success) {
        setIsEditing(true);
        toast.success('비밀번호가 확인되었습니다.');
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        toast.error('비밀번호가 틀렸습니다.');
      } else {
        toast.error('네트워크 오류가 발생했습니다. 인터넷 연결을 확인하세요.');
      }
    }
  };

  const handleUpdateInfo = () => {
    updateUser({ phone });
    setIsEditing(false);
    setPassword('');
    toast.success('정보 수정이 완료되었습니다.');
    setActiveTab(0); // 내 정보 탭으로 이동
  };

  const handleWithdrawal = () => {
    router.push('/withdrawal');
  };

  const handleItemClick = (id: string) => {
    router.push(`/purchase-detail?id=${id}`);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-center mb-6">마이 페이지</h1>
      <Tap tabs={['내 정보', '구매 내역', '정보 수정']} activeTab={activeTab} onTabChange={setActiveTab}>
        {[
          <Card key="info" className="bg-white shadow-md rounded-lg p-4">
            <div className="mb-4">
              <strong>이름:</strong> <br /> {user?.name || '홍길동'}
            </div>
            <div className="mb-4">
              <strong>이메일 주소:</strong> <br /> {user?.email || 'honggildong@example.com'}
            </div>
            <div className="mb-4">
              <strong>전화 번호:</strong> <br /> {user?.phone || '010-1234-5678'}
            </div>
            <div>
              <strong>마일리지:</strong> {user?.total_mileage || 0}
            </div>
          </Card>,
          <div key="history" className="space-y-4">
            {fakePurchases.length > 0 ? (
              <ul className="space-y-4">
                {fakePurchases.map((purchase) => (
                  <li
                    key={purchase.id}
                    onClick={() => handleItemClick(purchase.id)}
                    className="p-4 border rounded-lg shadow-sm hover:bg-gray-100 cursor-pointer"
                  >
                    <div className="flex justify-between">
                      <span className="font-semibold">{purchase.date}</span>
                      <span className="text-gray-600">{purchase.storeName}</span>
                    </div>
                    <div className="flex justify-between mt-2">
                      <span className="text-gray-600">{purchase.items}</span>
                      <span className="font-semibold">{purchase.amount.toLocaleString()}원</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center text-gray-600">구매 내역이 없습니다.</div>
            )}
          </div>,
          !isEditing ? (
            <>
              <Input
                key="password"
                type="password"
                placeholder="비밀번호 확인"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mb-4"
              />
              <Button
                key="confirm"
                type="button"
                label="확인"
                className="w-full bg-green-600 text-white"
                onClick={handlePasswordCheck}
              />
            </>
          ) : (
            <div key="edit" className="space-y-4">
              <div>
                <strong>이름:</strong> <br /> {user?.name || '홍길동'}
              </div>
              <div>
                <strong>이메일 주소:</strong> <br /> {user?.email || 'honggildong@example.com'}
              </div>
              <Input
                label="전화 번호"
                type="tel"
                placeholder="전화번호를 입력해 주세요"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="smsConsent"
                  checked={smsConsent}
                  onChange={(e) => setSmsConsent(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="smsConsent" className="ml-2 block text-sm text-gray-900">
                  SMS 발송 동의
                </label>
              </div>
              <Button
                type="button"
                label="정보 수정"
                className="w-full"
                onClick={handleUpdateInfo}
              />
              <Button
                type="button"
                label="회원 탈퇴"
                className="w-full bg-red-600 text-white mt-4"
                onClick={handleWithdrawal}
              />
            </div>
          ),
        ]}
      </Tap>
    </div>
  );
};

export default Profile;