import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@contexts/AuthContext';
import { useStore } from '@contexts/StoreContext';
import { useCart } from '@contexts/CartContext';
import { Button, Card, ErrorMessage } from '@components';
import { toast } from 'react-toastify';

const CartPage: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { currentStore } = useStore();
  const { cartItems, totalQuantity, totalPrice, removeFromCart } = useCart();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (!currentStore) {
      alert('매장을 알려주세요.');
      router.push('/store-select');
    }
  }, [isAuthenticated, currentStore, router]);

  if (!isAuthenticated || !currentStore) {
    return <ErrorMessage message="로그인 해주세요." />;
  }

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error('담긴 상품이 없습니다.');
    } else {
      router.push('/checkout');
    }
  };

  const handleMoreFruits = () => {
    router.push('/fruit-select');
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">장바구니</h1>
      {cartItems.length === 0 ? (
        <p className="text-center">장바구니가 비어 있습니다.</p>
      ) : (
        <div>
          {cartItems.map(item => (
            <Card key={item.id} className="mb-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold">{item.name}</h2>
                  <p className="text-sm text-gray-600">₩{item.price.toLocaleString()}</p>
                </div>
                <Button onClick={() => removeFromCart(item.id)} className="ml-2">
                  제거
                </Button>
              </div>
            </Card>
          ))}
          <div className="text-right mt-4">
            <p>총 수량: {totalQuantity}</p>
            <p>총 가격: ₩{totalPrice.toLocaleString()}</p>
          </div>
        </div>
      )}
      <Button onClick={handleMoreFruits} className="w-full mt-4 bg-green-500 text-white">
        과일 더 보기
      </Button>
      <Button onClick={handleCheckout} className="w-full mt-4 bg-blue-500 text-white">
        결제하기
      </Button>
    </div>
  );
};

export default CartPage;