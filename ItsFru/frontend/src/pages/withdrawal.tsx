import React from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { useAuth } from '@contexts/AuthContext';
import axios from 'axios';

const Withdrawal: React.FC = () => {
  const router = useRouter();
  const { logout, user } = useAuth();

  const handleWithdrawal = async () => {
    try {
      // 백엔드로 회원 탈퇴 요청 보내기
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/withdraw`, {
        email: user?.email,
      });

      // 탈퇴 성공 메시지 표시
      toast.success('그동안 이용해주셔서 감사했습니다.');

      // 로그아웃 및 매장 정보 비우기
      logout();

      // 랜딩 페이지로 이동
      router.push('/');
    } catch (error) {
      toast.error('회원 탈퇴에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  const handleCancel = () => {
    // 프로필 페이지로 이동
    router.push('/profile');
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-center mb-6">회원 탈퇴</h1>
      <p className="text-center text-gray-700 mb-4">
        회원 탈퇴 시 마일리지와 결제 내역이 모두 삭제됩니다. 이 작업은 되돌릴 수 없습니다.
      </p>
      <button
        onClick={handleWithdrawal}
        className="w-full py-2 px-4 mb-4 bg-red-600 text-white font-bold rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
      >
        탈퇴하기
      </button>
      <button
        onClick={handleCancel}
        className="w-full py-2 px-4 bg-gray-600 text-white font-bold rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
      >
        탈퇴 취소
      </button>
    </div>
  );
};

export default Withdrawal;