import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem } from './CartContext';

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered';

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  shippingAddress: string;
  shippingName: string;
  shippingPhone: string;
  createdAt: string;
}

interface OrderContextType {
  orders: Order[];
  placeOrder: (order: Omit<Order, 'id' | 'createdAt' | 'status'>) => Order;
  getUserOrders: (userId: string) => Order[];
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);
const ORDERS_KEY = 'shoestore_orders';

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(() => {
    const stored = localStorage.getItem(ORDERS_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  }, [orders]);

  const placeOrder = (order: Omit<Order, 'id' | 'createdAt' | 'status'>): Order => {
    const newOrder: Order = {
      ...order,
      id: crypto.randomUUID(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  };

  const getUserOrders = (userId: string) => orders.filter(o => o.userId === userId);

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => (o.id === orderId ? { ...o, status } : o)));
  };

  return (
    <OrderContext.Provider value={{ orders, placeOrder, getUserOrders, updateOrderStatus }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrders must be used within OrderProvider');
  return ctx;
}
