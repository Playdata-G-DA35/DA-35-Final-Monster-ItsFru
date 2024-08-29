import React from 'react';
import { useRouter } from 'next/router';
// import { useAuth } from '@contexts/AuthContext';
// import { useStore } from '@contexts/StoreContext';
// import { useCart } from '@contexts/CartContext';
import { Button, Card } from '@components';
// import { toast } from 'react-toastify';

const CartPage: React.FC = () => {
  const router = useRouter();
  // const { isAuthenticated } = useAuth();
  // const { currentStore } = useStore();
  // const { cartItems, removeFromCart, updateQuantity, getTotalPrice, getTotalItems } = useCart();

  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     router.push('/login');
  //   } else if (!currentStore) {
  //     toast.error('매장을 선택해주세요.');
  //     router.push('/store-select');
  //   }
  // }, [isAuthenticated, currentStore, router]);

  // if (!isAuthenticated || !currentStore) {
  //   return <ErrorMessage message="로그인 후 매장을 선택해주세요." />;
  // }

  const handleCheckout = () => {
    // if (cartItems.length === 0) {
    //   toast.error('담긴 상품이 없습니다.');
    // } else {
      router.push('/checkout');
    // }
  };

  const handleMoreFruits = () => {
    router.push('/fruit-select');
  };

  // 하드코딩된 데이터
  const cartItems = [
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

  const totalPrice = 3526 + (2500 * (1 - 0.10) * 2); // 사과 판매가 + 바나나 판매가
  const totalQuantity = 1 + 2; // 사과 수량 + 바나나 수량

  const updateQuantity = (id: number, newQuantity: number) => {
    console.log(`Update quantity of item ${id} to ${newQuantity}`);
  };

  const removeFromCart = (id: number) => {
    console.log(`Remove item ${id} from cart`);
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
                  <p className="text-sm text-gray-600">
                    ₩{(item.price * (1 - item.discountRate / 100)).toLocaleString()} / 개
                  </p>
                  <p className="text-xs text-gray-500">할인율: {item.discountRate}%</p>
                </div>
                <div className="flex items-center">
                  <Button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 py-1">
                    -
                  </Button>
                  <span className="mx-2">{item.quantity}</span>
                  <Button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 py-1">
                    +
                  </Button>
                  <Button onClick={() => removeFromCart(item.id)} className="ml-2">
                    제거
                  </Button>
                </div>
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