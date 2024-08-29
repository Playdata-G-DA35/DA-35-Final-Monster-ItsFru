import React, { createContext, useContext, useState, ReactNode } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FruitAnalysis } from '@contexts/StoreContext';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  discountRate: number;
}

interface PaymentInfo {
  totalAmount: number;
  useMileage: number;
  paymentMethod: 'CREDIT_CARD' | 'CASH' | 'MILEAGE';
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  addAnalyzedFruitToCart: (analyzedFruit: FruitAnalysis) => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  processPayment: (paymentInfo: PaymentInfo) => Promise<boolean>;
}


const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(i => i.id === item.id);
      if (existingItem) {
        return prevItems.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevItems, { ...item, quantity: 1 }];
    });
    toast.success(`${item.name}을(를) 장바구니에 추가했습니다.`);
  };

  const removeFromCart = (itemId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
    toast.info('상품을 장바구니에서 제거했습니다.');
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(itemId);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    toast.info('장바구니를 비웠습니다.');
  };

  const addAnalyzedFruitToCart = (analyzedFruit: FruitAnalysis) => {
    const newItem: CartItem = {
      id: `${analyzedFruit.fruit_type}-${Date.now()}`,
      name: analyzedFruit.fruit_type,
      price: analyzedFruit.price,
      quantity: 1,
      discountRate: analyzedFruit.discount_rate * 100
    };
    addToCart(newItem);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => 
      total + (item.price * (1 - item.discountRate / 100) * item.quantity), 0
    );
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const processPayment = async (paymentInfo: PaymentInfo): Promise<boolean> => {
    try {
      // 실제 결제 API 호출 대신 백엔드로 결제 정보 전송
      const response = await axios.post('/api/payment', {
        items: cartItems,
        ...paymentInfo
      });

      if (response.data.success) {
        toast.success('결제가 성공적으로 처리되었습니다.');
        clearCart(); // 결제 성공 후 장바구니 비우기
        return true;
      } else {
        toast.error('결제 처리 중 오류가 발생했습니다.');
        return false;
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      toast.error('결제 처리 중 오류가 발생했습니다.');
      return false;
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        addAnalyzedFruitToCart,
        getTotalPrice,
        getTotalItems,
        processPayment
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
