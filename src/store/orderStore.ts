import { create } from 'zustand';
import type { Order, CartItem, ShippingAddress } from '../types';

interface OrderState {
  orders: Order[];
  currentShippingAddress: ShippingAddress | null;
  setShippingAddress: (address: ShippingAddress) => void;
  placeOrder: (items: CartItem[], paymentStatus: 'paid' | 'failed') => Order;
  getOrders: () => Order[];
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: JSON.parse(localStorage.getItem('orders') || '[]'),
  currentShippingAddress: null,

  setShippingAddress: (address: ShippingAddress) => {
    set({ currentShippingAddress: address });
  },

  placeOrder: (items: CartItem[], paymentStatus: 'paid' | 'failed') => {
    const address = get().currentShippingAddress;

    const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const tax = Math.round(subtotal * 0.18);
    const total = subtotal + tax;

    const order: Order = {
      id: 'ORD-' + Date.now().toString(36).toUpperCase(),
      items,
      shippingAddress: address || {
        fullName: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        phone: '',
      },
      subtotal,
      tax,
      total,
      status: paymentStatus === 'paid' ? 'processing' : 'cancelled',
      paymentStatus,
      date: new Date().toISOString(),
    };

    set((state) => {
      const newOrders = [order, ...state.orders];
      localStorage.setItem('orders', JSON.stringify(newOrders));
      return { orders: newOrders };
    });

    return order;
  },

  getOrders: () => {
    return get().orders;
  },
}));
