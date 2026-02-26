import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem } from './CartContext';
import { API_BASE_URL } from '@/lib/api';

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
  phone?: string;
  product_name?: string;
  size?: string;
  address?: string;
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
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // Poll orders every 5 seconds or fetch on mount. For simplicity, fetch on mount.
    // In a real app, use React Query.
    fetch(`${API_BASE_URL}/api/orders`).then(res => res.json()).then(data => {
      if (Array.isArray(data)) setOrders(data);
    }).catch(err => console.error(err));

    const interval = setInterval(() => {
      fetch(`${API_BASE_URL}/api/orders`).then(res => res.json()).then(data => {
        if (Array.isArray(data)) setOrders(data);
      }).catch(e => console.error(e));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const placeOrder = async (order: Omit<Order, 'id' | 'createdAt' | 'status'>): Promise<Order> => {
    const newOrder = {
      ...order,
      id: crypto.randomUUID(),
      // API expects these fields, ensure they match schema
      shippingName: order.shippingName,
      shippingAddress: order.shippingAddress,
      shippingPhone: order.shippingPhone,
      phone: order.phone,
      product_name: order.product_name,
      size: order.size,
      address: order.address,
      items: order.items,
      total: order.total,
      userId: order.userId
    };

    try {
      await fetch(`${API_BASE_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder)
      });
      // Optimistic update or refetch
      const createdOrder = { ...newOrder, status: 'pending' as OrderStatus, createdAt: new Date().toISOString() };
      setOrders(prev => [createdOrder, ...prev]);
      return createdOrder;
    } catch (e) {
      console.error("Order creation failed", e);
      throw e;
    }
  };

  const getUserOrders = (userId: string) => orders.filter(o => o.userId === userId);

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      await fetch(`${API_BASE_URL}/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      setOrders(prev => prev.map(o => (o.id === orderId ? { ...o, status } : o)));
    } catch (e) {
      console.error("Failed to update status", e);
    }
  };

  return (
    <OrderContext.Provider value={{ orders, placeOrder: placeOrder as any, getUserOrders, updateOrderStatus }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrders must be used within OrderProvider');
  return ctx;
}
