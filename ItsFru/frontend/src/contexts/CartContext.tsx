import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  totalQuantity: number;
  totalPrice: number;
  addToCart: (product: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cartItems');
      return savedCart ? JSON.parse(savedCart) : [];
    }
    return [];
  });

  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    calculateTotals();
    if (typeof window !== 'undefined') {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }
  }, [cartItems]);

  const addToCart = async (product: Omit<CartItem, 'quantity'>) => {
    try {
      // 서버에 장바구니 항목 추가 요청
      const response = await axios.post('/api/cart', { ...product, quantity: 1 });
      const updatedItem = response.data;

      setCartItems(prevItems => {
        const existingItem = prevItems.find(item => item.id === updatedItem.id);
        if (existingItem) {
          return prevItems.map(item =>
            item.id === updatedItem.id ? { ...item, quantity: item.quantity + 1 } : item
          );
        }
        return [...prevItems, { ...updatedItem }];
      });
    } catch (error) {
      console.error('Failed to add item to cart:', error);
    }
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity > 0 ? newQuantity : 0 }
          : item
      ).filter(item => item.quantity > 0)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const calculateTotals = () => {
    const { quantity, price } = cartItems.reduce(
      (acc, item) => ({
        quantity: acc.quantity + item.quantity,
        price: acc.price + item.price * item.quantity,
      }),
      { quantity: 0, price: 0 }
    );
    setTotalQuantity(quantity);
    setTotalPrice(price);
  };

  return (
    <CartContext.Provider 
      value={{ 
        cartItems, 
        totalQuantity, 
        totalPrice, 
        addToCart, 
        removeFromCart, 
        updateQuantity, 
        clearCart 
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