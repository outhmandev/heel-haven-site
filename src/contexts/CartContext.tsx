import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  size: number;
  quantity: number;
  image: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (productId: string, size: number) => void;
  updateQuantity: (productId: string, size: number, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const CART_KEY = 'shoestore_cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    const stored = localStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    setItems(prev => {
      const existing = prev.find(i => i.productId === item.productId && i.size === item.size);
      if (existing) {
        return prev.map(i =>
          i.productId === item.productId && i.size === item.size
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeItem = (productId: string, size: number) => {
    setItems(prev => prev.filter(i => !(i.productId === productId && i.size === size)));
  };

  const updateQuantity = (productId: string, size: number, quantity: number) => {
    if (quantity <= 0) return removeItem(productId, size);
    setItems(prev =>
      prev.map(i =>
        i.productId === productId && i.size === size ? { ...i, quantity } : i
      )
    );
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
