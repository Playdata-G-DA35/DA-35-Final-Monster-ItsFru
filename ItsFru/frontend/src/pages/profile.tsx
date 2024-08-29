import { GetServerSideProps,  GetServerSidePropsContext } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { useEffect, useState } from 'react';
import { useAuth, User } from '@contexts/AuthContext';
import { useRouter } from 'next/router';
import { Tap, Card, Input, Button } from '@components';  // Tap 컴포넌트 import
import useSWR from 'swr';

interface PageProps {
  isRefreshed: boolean;
}

interface TransactionSummary {
  id: number;
  date: string;
  storeName: string;
  items: string;
  amount: number;
}

const MyPage: React.FC<PageProps> = ({ isRefreshed }) => {
  const { user, isAuthenticated, getToken, logout, updateUser, changePassword, withdrawAccount, verifyPassword } = useAuth();
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [smsConsent, setSmsConsent] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isCheckingPassword, setIsCheckingPassword] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const fetcher = async (url: string) => {
    const token = getToken();
    if (!token) {
      throw new Error('No access token found');
    }
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      if (response.status === 401) {
        logout();
        router.push('/login');
        throw new Error('Session expired. Please log in again.');
      }
      throw new Error('An error occurred while fetching the data.');
    }
    return response.json();
  };

  const { data: purchases, error: purchasesError, isValidating: isLoadingPurchases } = useSWR<TransactionSummary[]>(
    isAuthenticated ? `/user/${user?.user_id}/transactions` : null,
    fetcher
  );

  useEffect(() => {
    if (user) {
      setPhone(user.phone_number);
      setSmsConsent(user.sms_consent);
    }
  }, [user]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (!isRefreshed) {
      router.push(`${router.pathname}?refresh=true`, undefined, { shallow: true });
    }
  }, [isRefreshed, router]);

  const handlePasswordCheck = async () => {
    setIsCheckingPassword(true);
    try {
      const isValid = await verifyPassword(currentPassword);
      if (isValid) {
        setIsEditing(true);
        setCurrentPassword('');
      } else {
        alert('비밀번호가 일치하지 않습니다.');
      }
    } catch (error) {
      console.error('Password verification failed:', error);
      alert('비밀번호 확인 중 오류가 발생했습니다.');
    } finally {
      setIsCheckingPassword(false);
    }
  };

  const handleUpdateInfo = async () => {
    setIsUpdating(true);
    try {
      await updateUser({ phone_number: phone, sms_consent: smsConsent });
      alert('정보가 성공적으로 업데이트되었습니다.');
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update user info:', error);
      alert('정보 업데이트에 실패했습니다.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert('새 비밀번호가 일치하지 않습니다.');
      return;
    }
    setIsUpdating(true);
    try {
      await changePassword(currentPassword, newPassword);
      alert('비밀번호가 성공적으로 변경되었습니다.');
      setIsChangingPassword(false);
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Failed to change password:', error);
      alert('비밀번호 변경에 실패했습니다.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleWithdrawal = async () => {
    if (window.confirm('정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      try {
        await withdrawAccount();
        alert('회원 탈퇴가 완료되었습니다.');
        router.push('/');
      } catch (error) {
        console.error('Failed to withdraw account:', error);
        alert('회원 탈퇴에 실패했습니다.');
      }
    }
  };

  const handleItemClick = (id: number) => {
    // Implement the logic to show transaction details
    console.log(`Clicked item with id: ${id}`);
  };

  if (!isAuthenticated || !user) {
    return <div>Loading...</div>;
  }

  const tabs = [
    {
      label: '내 정보',
      content: (
        <Card className="p-6 bg-white shadow-lg rounded-lg">
          <div className="space-y-4">
            <div>
              <p className="font-semibold">이름</p>
              <p>{user.name}</p>
            </div>
            <div>
              <p className="font-semibold">이메일</p>
              <p>{user.email}</p>
            </div>
            <div>
              <p className="font-semibold">전화 번호</p>
              <p>{user.phone_number}</p>
            </div>
            <div>
              <p className="font-semibold">마일리지</p>
              <p>{user.total_mileage}</p>
            </div>
          </div>
        </Card>
      )
    },
    {
      label: '구매 내역',
      content: (
        <Card className="p-6">
          {isLoadingPurchases ? (
            <div className="text-center py-4">구매 내역을 불러오는 중...</div>
          ) : purchases && purchases.length > 0 ? (
            <div className="space-y-4">
              {purchases.map((purchase) => (
                <div key={purchase.id} onClick={() => handleItemClick(purchase.id)} className="p-4 border rounded-lg shadow-sm hover:bg-gray-100 cursor-pointer transition duration-300">
                  <div className="grid grid-cols-2 gap-2">
                    <p><strong>날짜:</strong> {purchase.date}</p>
                    <p><strong>상점:</strong> {purchase.storeName}</p>
                    <p><strong>상품:</strong> {purchase.items}</p>
                    <p><strong>금액:</strong> {purchase.amount}원</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">구매 내역이 없습니다.</div>
          )}
        </Card>
      )
    },
    {
      label: '정보 수정',
      content: (
        <Card className="p-6">
          {!isEditing ? (
            <div className="space-y-4">
              <Input
                type="password"
                value={currentPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurrentPassword(e.target.value)}
                placeholder="현재 비밀번호"
                className="w-full"
              />
              <Button 
                onClick={handlePasswordCheck} 
                disabled={isCheckingPassword}
                className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
              >
                {isCheckingPassword ? '확인 중...' : '비밀번호 확인'}
              </Button>
            </div>
          ) : isChangingPassword ? (
            <div className="space-y-4">
              <Input
                type="password"
                value={newPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
                placeholder="새 비밀번호"
                className="w-full"
              />
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                placeholder="새 비밀번호 확인"
                className="w-full"
              />
              <div className="flex space-x-4">
                <Button 
                  onClick={handleChangePassword} 
                  disabled={isUpdating || !newPassword || !confirmPassword || newPassword !== confirmPassword}
                  className="flex-1 py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300"
                >
                  확인
                </Button>
                <Button 
                  onClick={() => {
                    setIsChangingPassword(false);
                    setNewPassword('');
                    setConfirmPassword('');
                  }}
                  className="flex-1 py-2 px-4 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition duration-300"
                >
                  취소
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="font-semibold">이름</p>
                <p>{user.name}</p>
              </div>
              <div>
                <p className="font-semibold">이메일</p>
                <p>{user.email}</p>
              </div>
              <div>
              <p className="font-semibold">휴대폰 번호</p>
                <Input
                  value={phone}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
                  placeholder="휴대폰 번호"
                  className="mt-1 block w-full px-3 py-2 border border-green-500 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 bg-green-100 text-black"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  type="checkbox"
                  id="smsConsent"
                  checked={smsConsent}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSmsConsent(e.target.checked)}
                />
                <label htmlFor="smsConsent">SMS 수신 동의</label>
              </div>
              <div className="space-y-2">
                <Button 
                  onClick={handleUpdateInfo} 
                  disabled={isUpdating}
                  className="w-full py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300"
                >
                  {isUpdating ? '수정 중...' : '정보 수정'}
                </Button>
                <Button 
                  onClick={() => setIsChangingPassword(true)}
                  className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
                >
                  비밀번호 변경
                </Button>
                <Button 
                  onClick={handleWithdrawal} 
                  className="w-full py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300"
                >
                  회원 탈퇴
                </Button>
              </div>
            </div>
          )}
        </Card>
      )
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">마이 페이지</h1>
      <Tap
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  context: GetServerSidePropsContext<ParsedUrlQuery>
) => {
  const { query } = context;
  const isRefreshed = query.refresh === 'true';

  return { 
    props: { 
      isRefreshed 
    } 
  };
};

export default MyPage;